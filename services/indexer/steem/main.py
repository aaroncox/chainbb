import collections
import inspect
import json
import os
import sys
import time
from datetime import datetime, timedelta
from pprint import pprint

from apscheduler.schedulers.background import BackgroundScheduler
from pymongo import MongoClient
from steem import Steem
from steem.blockchain import Blockchain
from steem.converter import Converter
from steem.steemd import Steemd
from steem.utils import block_num_from_hash
from bs4 import BeautifulSoup

#########################################
# Connections
#########################################

# steemd
nodes = [
    # 'http://192.168.1.50:8090',
    os.environ['steem_node']
]
s = Steem(nodes)
d = Steemd(nodes)
b = Blockchain(steemd_instance=s, mode='head')
c = Converter(steemd_instance=s)

fullnodes = [
    'https://rpc.buildteam.io',
    'https://api.steemit.com',
    'https://steemd.steemit.com',
]
fn = Steem(fullnodes)

# MongoDB
ns = os.environ['namespace'] if 'namespace' in os.environ else ''
mongo = MongoClient("mongodb://mongo")
db = mongo[ns]

# MongoDB Schema Enforcement
# db.forum_requests.ensure_index('timestamp', expireAfterSeconds=60*60) # Forum creation request TTL

# timestamp = datetime.now()
# db.forum_requests.insert({'_id': 'session', "timestamp": timestamp, "session": "test session"})
# utc_timestamp = datetime.utcnow()
# db.forum_requests.insert({'_id': 'utc_session', "timestamp": utc_timestamp, "session": "test session"})

#########################################
# Globals
#########################################

# Which block was last processed
init = db.status.find_one({'_id': 'height_processed'})
if(init):
    last_block_processed = int(init['value'])
else:
    last_block_processed = 1

# Global Properties
props = {}

# Forums Cache
forums_cache = {}

# Vote Queue
vote_queue = []

# Known Bots
bots = set()

# ------------
# If the indexer is behind more than the quick_value, it will:
#
#     - stop updating posts based on votes processed
#
# This is useful for when you need the index to catch up to the latest block
# ------------
quick_value = 100

# ------------
# For development:
#
# If you're looking for a faster way to sync the data and get started,
# uncomment this line with a more recent block, and the chain will start
# to sync from that point onwards. Great for a development environment
# where you want some data but don't want to sync the entire blockchain.
# ------------

# last_block_processed = 16528580


def l(msg):
    caller = inspect.stack()[1][3]
    print("[FORUM][INDEXER][{}] {}".format(str(caller), str(msg)))
    sys.stdout.flush()


def process_op(op, block, quick=False):
    # Split the array into type and data
    opType = op[0]
    opData = op[1]
    if opType == "custom_json" and opData['id'] == ns:
        process_custom_op(opData)
    if opType == "vote" and quick == False:
        queue_parent_update(opData)
    if opType == "comment":
        process_post(opData, block, quick=False)
    if opType == "delete_comment":
        remove_post(opData)
    if opType == "comment_benefactor_reward":
        process_benefactor_reward(opData)


def process_benefactor_reward(opData):
    _id = opData['author'] + '/' + opData['permlink']
    # l(_id)
    try:
        # Load the post now that it processed rewards
        comment = load_post(_id, opData['author'], opData['permlink'])
        # Ensure we a post was returned
        if comment['author'] != '':
            db.rewards.update({'_id': _id}, {'$set': {
                'author': opData['author'],
                'author_payout': comment['total_payout_value'],
                'category': comment['category'],
                'curator_payout': comment['curator_payout_value'],
                'permlink': opData['permlink'],
                'platform_payout': float(opData['reward'].split(' ')[0]),
                'timestamp': comment['last_payout'],
            }}, upsert=True)
            # Update the post in the DB since we have it (once last time)
            comment.update({
                'active_votes': collapse_votes(comment['active_votes'])
            })
            # If this is a top level post, update the `posts` collection
            if comment['parent_author'] == '':
                db.posts.update({'_id': _id}, {'$set': comment}, upsert=True)
            # Otherwise save it into the `replies` collection and update the parent
            else:
                # Update this post within the `replies` collection
                db.replies.update({'_id': _id}, {'$set': comment}, upsert=True)
    except:
        l("Error parsing post")
        l(comment)
        pass


def process_custom_op(custom_json):
    # Process the JSON
    op = json.loads(custom_json['json'])
    # Split the array into type and data
    opType = op[0]
    opData = op[1]
    if opType == 'modpost':
        process_modpost(opData, custom_json)


def process_modpost(opData, custom_json):
    moderator = custom_json['required_posting_auths'][0]
    forum = opData['forum']
    topic = opData['topic']
    if isModerator(moderator, forum):
        if 'remove' in opData:
            if opData['remove'] == True:
                l("{} removed {} in {}".format(moderator, topic, forum))
                db.posts.update({'_id': topic}, {'$addToSet': {
                    '_removedFrom': forum
                }})
            if opData['remove'] == False:
                l("{} restored {} in {}".format(moderator, topic, forum))
                db.posts.update({'_id': topic}, {'$pull': {
                    '_removedFrom': forum
                }})


def isModerator(user, forum):
    if user == 'jesta':
        return True
    return False


def remove_post(opData):
    author = opData['author']
    permlink = opData['permlink']

    # Generate ID
    _id = author + '/' + permlink
    l("post self-removed {}".format(_id))

    # Remove any matches
    db.posts.remove({'_id': _id})
    db.replies.remove({'_id': _id})


def queue_parent_update(opData):
    global vote_queue
    # Determine ID
    _id = opData['author'] + '/' + opData['permlink']
    # Append to Queue
    vote_queue.append(_id)
    # Make the list of queue items unique (to prevent updating the same post more than once per block)
    keys = {}
    for e in vote_queue:
        keys[e] = True
    # Set the list to the unique values
    vote_queue = list(keys.keys())
    # pprint("-----------------------------")
    # pprint("Vote Queue")
    # pprint(opData)
    # pprint(vote_queue)
    # pprint("-----------------------------")


def load_post(_id, author, permlink):
    # Fetch from the rpc
    comment = s.get_content(author, permlink).copy()
    # Add our ID
    comment.update({
        '_id': _id,
    })
    # Remap into our storage format
    for key in ['abs_rshares', 'children_rshares2', 'net_rshares', 'children_abs_rshares', 'vote_rshares', 'total_vote_weight', 'root_comment', 'promoted', 'max_cashout_time', 'body_length', 'reblogged_by', 'replies']:
        comment.pop(key, None)
    for key in ['author_reputation']:
        comment[key] = float(comment[key])
    for key in ['total_pending_payout_value', 'pending_payout_value', 'max_accepted_payout', 'total_payout_value', 'curator_payout_value']:
        comment[key] = float(comment[key].split()[0])
    for key in ['active', 'created', 'cashout_time', 'last_payout', 'last_update']:
        comment[key] = datetime.strptime(comment[key], "%Y-%m-%dT%H:%M:%S")
    for key in ['json_metadata']:
        try:
            comment[key] = json.loads(comment[key])
        except ValueError:
            comment[key] = comment[key]
    return comment


def get_parent_post_id(reply):
    # Determine the original post's ID based on the URL provided
    url = reply['url'].split('#')[0]
    parts = url.split('/')
    parent_id = parts[2].replace('@', '') + '/' + parts[3]
    return parent_id


def update_parent_post(parent_id, reply):
    # Prevent bots from updating the parent post
    if reply['author'] in bots:
        l("skipping bot {} - {}".format(reply['author'], reply['url']))
        return
    # Split the ID into parameters for loading the post
    author, permlink = parent_id.split('/')
    # Load + Parse the parent post
    # l(parent_id)
    parent_post = load_post(parent_id, author, permlink)
    # Update the parent post (within `posts`) to show last_reply + last_reply_by
    parent_post.update({
        'active_votes': collapse_votes(parent_post['active_votes']),
        'last_reply': reply['created'],
        'last_reply_by': reply['author'],
        'last_reply_url': reply['url']
    })
    # Set the update parameters
    query = {
        '_id': parent_id
    }
    update = {
        '$set': parent_post
    }
    db.posts.update(query, update)


def update_indexes(comment):
    if comment['author'] not in bots:
        update_topics(comment)
        update_forums(comment)


def update_topics(comment):
    query = {
        '_id': comment['category'],
    }
    updates = {
        '_id': comment['category'],
        'updated': comment['created']
    }
    if comment['parent_author'] == '':
        updates.update({
            'last_post': {
                'created': comment['created'],
                'author': comment['author'],
                'title': comment['title'],
                'url': comment['url']
            }
        })
    else:
        updates.update({
            'last_reply': {
                'created': comment['created'],
                'author': comment['author'],
                'title': comment['root_title'],
                'url': comment['url']
            }
        })
    db.topics.update(query, {'$set': updates, }, upsert=True)


def update_forums_last_post(index, comment):
    # l("updating /forum/{} with post {}/{})".format(index, comment['author'], comment['permlink']))
    query = {
        '_id': index,
    }
    updates = {
        '_id': index,
        'updated': comment['created'],
        'last_post': {
            'created': comment['created'],
            'author': comment['author'],
            'title': comment['title'],
            'url': comment['url']
        }
    }
    increments = {
        'stats.posts': 1
    }
    db.forums.update(query, {'$set': updates, '$inc': increments}, upsert=True)


def update_forums_last_reply(index, comment):
    # l("updating /forum/{} with post {}/{})".format(index, comment['author'], comment['permlink']))
    query = {
        '_id': index,
    }
    updates = {
        '_id': index,
        'updated': comment['created'],
        'last_reply': {
            'created': comment['created'],
            'author': comment['author'],
            'title': comment['root_title'],
            'url': comment['url']
        }
    }
    increments = {
        'stats.replies': 1
    }
    db.forums.update(query, {'$set': updates, '$inc': increments}, upsert=True)


def update_forums(comment):
    for index in forums_cache:
        if ((
            'tags' in forums_cache[index]
            and
            comment['category'] in forums_cache[index]['tags']
        ) or (
            'accounts' in forums_cache[index]
            and
            comment['author'] in forums_cache[index]['accounts']
        )):
            if comment['parent_author'] == '':
                update_forums_last_post(index, comment)
            else:
                update_forums_last_reply(index, comment)


def process_vote(_id, author, permlink):
    # Grab the parsed data of the post
    # l(_id)
    comment = load_post(_id, author, permlink)
    # Ensure we a post was returned
    if comment['author'] != '':
        comment.update({
            'active_votes': collapse_votes(comment['active_votes'])
        })
        # If this is a top level post, update the `posts` collection
        if comment['parent_author'] == '':
            db.posts.update({'_id': _id}, {'$set': comment}, upsert=True)
        # Otherwise save it into the `replies` collection and update the parent
        else:
            # Update this post within the `replies` collection
            db.replies.update({'_id': _id}, {'$set': comment}, upsert=True)


def collapse_votes(votes):
    collapsed = []
    # Convert time to timestamps
    for key, vote in enumerate(votes):
        votes[key]['time'] = int(datetime.strptime(
            votes[key]['time'], "%Y-%m-%dT%H:%M:%S").strftime("%s"))
    # Sort based on time
    sortedVotes = sorted(votes, key=lambda k: k['time'])
    # Iterate and append to return value
    for vote in votes:
        collapsed.append([
            vote['voter'],
            vote['percent']
        ])
    return collapsed


def process_post(opData, block, quick=False):
    # Derive the timestamp
    ts = float(datetime.strptime(
        block['timestamp'], "%Y-%m-%dT%H:%M:%S").strftime("%s"))
    # Create the author/permlink identifier
    author = opData['author']
    permlink = opData['permlink']
    _id = author + '/' + permlink
    # Grab the parsed data of the post
    l(_id)
    comment = load_post(_id, author, permlink)
    # Determine where it's posted from, and record for active users
    if isinstance(comment['json_metadata'], dict) and 'app' in comment['json_metadata'] and not quick:
        try:
            app = comment['json_metadata']['app'].split("/")[0]
            db.activeusers.update({
                '_id': comment['author']
            }, {
                '$set': {
                    '_id': comment['author'],
                    'ts': datetime.strptime(block['timestamp'], "%Y-%m-%dT%H:%M:%S")
                },
                '$addToSet': {'app': app},
            }, upsert=True)
        except:
            pass
    # Update the indexes it's contained within
    update_indexes(comment)
    # Collapse the votes
    comment.update({
        'active_votes': collapse_votes(comment['active_votes'])
    })
    try:
            # Ensure we a post was returned
        if comment['author'] != '':
            # If this is a top level post, save into the `posts` collection
            if comment['parent_author'] == '':
                db.posts.update({'_id': _id}, {'$set': comment}, upsert=True)
            # Otherwise save it into the `replies` collection and update the parent
            else:
                # Get the parent_id to update
                parent_id = get_parent_post_id(comment)
                # Add the `root_post` field containing the ID of the parent
                comment.update({
                    'root_post': parent_id
                })
                # Update the parent post to indicate a new reply
                update_parent_post(parent_id, comment)
                # Update this post within the `replies` collection
                db.replies.update({'_id': _id}, {'$set': comment}, upsert=True)
    except:
        l("Error parsing post")
        l(comment)
        pass


def rebuild_forums_cache():
    # l("rebuilding forums cache ({} forums)".format(len(list(forums))))
    forums = db.forums.find()
    forums_cache.clear()
    for forum in forums:
        cache = {}
        if 'accounts' in forum and len(forum['accounts']) > 0:
            cache.update({'accounts': forum['accounts']})
        if 'parent' in forum:
            cache.update({'parent': forum['parent']})
        if 'tags' in forum and len(forum['tags']) > 0:
            cache.update({'tags': forum['tags']})
        forums_cache.update({str(forum['_id']): cache})


def process_vote_queue():
    global vote_queue
    # l("Updating {} posts that were voted upon.".format(len(vote_queue)))
    # Process all queued votes from block
    for _id in vote_queue:
        # Split the ID into parameters for loading the post
        author, permlink = _id.split('/')
        # Process the votes
        process_vote(_id, author, permlink)
    vote_queue = []


def process_global_props():
    global props
    props = d.get_dynamic_global_properties()
    # Save height
    db.status.update({'_id': 'height'}, {
                     "$set": {'value': props['last_irreversible_block_num']}}, upsert=True)
    # Save steem_per_mvests
    db.status.update({'_id': 'sbd_median_price'}, {
                     "$set": {'value': c.sbd_median_price()}}, upsert=True)
    db.status.update({'_id': 'steem_per_mvests'}, {
                     "$set": {'value': c.steem_per_mvests()}}, upsert=True)
    # l("Props updated to #{}".format(props['last_irreversible_block_num']))


def process_rewards_pools():
    # Save reward pool info
    fund = s.get_reward_fund('post')
    reward_balance = float(fund["reward_balance"].split(" ")[0])
    db.status.update({'_id': 'reward_balance'}, {
                     "$set": {'value': reward_balance}}, upsert=True)
    recent_claims = int(fund["recent_claims"].split(" ")[0])
    db.status.update({'_id': 'recent_claims'}, {
                     "$set": {'value': recent_claims}}, upsert=True)


def process_platform_history():
    l("platform account")
    moreops = True
    limit = 100
    # How many history ops have been processed previously?
    init = db.status.find_one({'_id': 'history_processed'})
    if(init):
        last_op_processed = int(init['value'])
    else:
        last_op_processed = limit
    while moreops:
        ops = fn.get_account_history(ns, last_op_processed + 100, limit)
        if ops[-1][0] == last_op_processed:
            moreops = False
        for idx, op in ops:
            if idx > last_op_processed:
                block = {
                    'timestamp': op['timestamp'],
                }
                process_op(op['op'], block)
                last_op_processed = idx
                db.status.update({'_id': 'history_processed'}, {'$set': {'value': idx}}, upsert=True)


def rebuild_bots_cache():
    global bots
    docs = db.bots.find()
    for bot in docs:
        bots.add(str(bot['_id']))

if __name__ == '__main__':
    l("Starting services @ block #{}".format(last_block_processed))

    process_platform_history()
    process_global_props()
    process_rewards_pools()
    rebuild_forums_cache()
    rebuild_bots_cache()

    scheduler = BackgroundScheduler()
    scheduler.add_job(process_global_props, 'interval', seconds=9, id='process_global_props')
    scheduler.add_job(rebuild_forums_cache, 'interval', minutes=1, id='rebuild_forums_cache')
    scheduler.add_job(rebuild_bots_cache, 'interval', minutes=1, id='rebuild_bots_cache')
    scheduler.add_job(process_vote_queue, 'interval', minutes=5, id='process_vote_queue')
    scheduler.add_job(process_rewards_pools, 'interval', minutes=10, id='process_rewards_pools')
    scheduler.add_job(process_platform_history, 'interval', minutes=10, id='process_platform_history')
    scheduler.start()

    quick = False
    for block in b.stream_from(start_block=last_block_processed, full_blocks=True):
        if(len(block['transactions']) > 0):
            block_num = block_num_from_hash(block['block_id'])
            timestamp = block['timestamp']
            # If behind by more than X (for initial indexes), set quick to true to prevent unneeded past operations
            remaining_blocks = props['last_irreversible_block_num'] - block_num
            if remaining_blocks > quick_value:
                quick = True
            dt = datetime.strptime(timestamp, "%Y-%m-%dT%H:%M:%S")
            l("----------------------------------")
            l("#{} - {} - {} ops ({} remaining|quick:{})".format(block_num,
                                                                 dt, len(block), remaining_blocks, quick))
            for tx in block['transactions']:
                for op in tx['operations']:
                    process_op(op, block, quick=quick)

            # Update our saved block height
            db.status.update({'_id': 'height_processed'}, {
                             "$set": {'value': block_num}}, upsert=True)

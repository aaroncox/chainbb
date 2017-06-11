from datetime import datetime, timedelta
from steem import Steem
from pymongo import MongoClient
from pprint import pprint
import collections
import json
import inspect
import time
import sys
import os

# Connections
nodes = [
    'http://localhost:5090'
]
s = Steem(nodes)
mongo = MongoClient("mongodb://mongo")
db = mongo.forums

# Determine which block was last processed
init = db.status.find_one({'_id': 'height'})
if(init):
  last_block = init['value']
else:
  last_block = 1

forums_cache = {}
vote_queue = []

# ------------
# If the indexer is behind more than the quick_value, it will:
#
#     - stop updating posts based on votes processed
#
# This is useful for when you need the index to catch up to current day
# ------------
quick_value = 500

# ------------
# For development:
#
# If you're looking for a faster way to sync the data and get started,
# uncomment this line with a more recent block, and the chain will start
# to sync from that point onwards. Great for a development environment
# where you want some data but don't want to sync the entire blockchain.
# ------------

# last_block = 12654018

def l(msg):
    caller = inspect.stack()[1][3]
    print("[FORUM][INDEXER][{}] {}".format(str(caller), str(msg)))

def process_op(opObj, block, blockid, quick=False):
    # Split the array into type and data
    opType = opObj[0]
    opData = opObj[1]
    if opType == "vote" and quick == False:
        queue_parent_update(opData, block, blockid)
    if opType == "comment":
        process_post(opData, block, blockid, quick=False)

def queue_parent_update(op, block, blockid):
    global vote_queue
    # Determine ID
    _id = op['author'] + '/' + op['permlink']
    # Append to Queue
    vote_queue.append(_id)
    # Make the list of queue items unique (to prevent updating the same post more than once per block)
    keys = {}
    for e in vote_queue:
        keys[e] = 1
    # Set the list to the unique values
    vote_queue = list(keys.keys())

def process_block(blockid, quick):
    global vote_queue
    # Get full block
    block = s.get_block(blockid)
    dt = datetime.strptime(block['timestamp'], "%Y-%m-%dT%H:%M:%S")
    print("\n[FORUM][INDEXER][process_block] - #" + str(last_block) + " " + str(dt) + " (" + str(block_number - last_block)+ " remaining, quick: " + str(quick) + ")")
    # Process all base ops
    for tx in block['transactions']:
        for opObj in tx['operations']:
            process_op(opObj, block, blockid, quick=quick)

    # ---------------------
    # Processing of virtual ops - disabled until needed
    # ---------------------
    # # Get all ops
    # ops = s.get_ops_in_block(blockid, False)
    # # Process all ops
    # for opObj in ops:
    #     pprint(opObj['op'])
    #     process_op(opObj['op'], block, blockid, quick=quick)

    # Process all queued votes from block
    for _id in vote_queue:
        # Split the ID into parameters for loading the post
        author, permlink = _id.split('/')
        # Process the votes
        process_vote(_id, author, permlink)
    vote_queue = []

def parse_post(_id, author, permlink):
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
    # Split the ID into parameters for loading the post
    author, permlink = parent_id.split('/')
    # Load + Parse the parent post
    l(parent_id)
    parent_post = parse_post(parent_id, author, permlink)
    # Update the parent post (within `posts`) to show last_reply + last_reply_by
    parent_post.update({
        'active_votes': collapse_votes(parent_post['active_votes']),
        'last_reply': reply['created'],
        'last_reply_by': reply['author']
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
    l(_id)
    comment = parse_post(_id, author, permlink)
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
        votes[key]['time'] = int(datetime.strptime(votes[key]['time'], "%Y-%m-%dT%H:%M:%S").strftime("%s"))
    # Sort based on time
    sortedVotes = sorted(votes, key=lambda k: k['time'])
    # Iterate and append to return value
    for vote in votes:
        collapsed.append([
            vote['voter'],
            vote['percent']
        ])
    return collapsed

def process_post(op, block, blockid, quick=False):
    # Derive the timestamp
    ts = float(datetime.strptime(block['timestamp'], "%Y-%m-%dT%H:%M:%S").strftime("%s"))
    # Create the author/permlink identifier
    author = op['author']
    permlink = op['permlink']
    _id = author + '/' + permlink
    # Grab the parsed data of the post
    l(_id)
    comment = parse_post(_id, author, permlink)
    # Determine where it's posted from, and record for active users
    if isinstance(comment['json_metadata'], dict) and 'app' in comment['json_metadata'] and not quick:
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
            if op['parent_author'] == '':
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

if __name__ == '__main__':
    print("[FORUM][INDEXER] - Starting service")

    # Determine block generation rate
    config = s.get_config()
    block_interval = config["STEEMIT_BLOCK_INTERVAL"]

    # Initial quick flag
    quick = False

    # Loop indefinitely - Process New Blocks
    while True:
        # Get global props for block height
        props = s.get_dynamic_global_properties()
        # Work off head as opposed to irreverisable since data will be overwritten anyways
        block_number = props['head_block_number']
        # Store the head_block_number so the website can show how far behind it is
        db.status.update({'_id': 'head_block_number'}, {"$set": {'value': block_number}}, upsert=True)
        # Update our indexes cache
        rebuild_forums_cache();
        # Process new blocks
        while (block_number - last_block) > 0:
            last_block += 1
            # If behind by more than X (for initial indexes), set quick to true to prevent unneeded past operations
            if (block_number - last_block) > quick_value:
                quick = True
            # Process block
            process_block(last_block, quick)
            # Update our block height
            db.status.update({'_id': 'height'}, {"$set" : {'value': last_block}}, upsert=True)
            # if last_block % 100 == 0:
            sys.stdout.flush()

        # Reset quick flag
        quick = False
        sys.stdout.flush()

        # Sleep for one block
        time.sleep(block_interval)

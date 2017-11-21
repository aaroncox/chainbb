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
    os.environ['steem_node'] if 'steem_node' in os.environ else 'https://api.steemit.com',
]
s = Steem(nodes)
c = Converter(steemd_instance=s)

# MongoDB
ns = os.environ['namespace'] if 'namespace' in os.environ else 'chainbb'
mongo = MongoClient('mongodb://mongo')
db = mongo[ns]

def l(msg):
    caller = inspect.stack()[1][3]
    print('[FORUM][ACCOUNT][{}] {}'.format(str(caller), str(msg)))
    sys.stdout.flush()

def process_op(op, tx, quick=False):
    # Split the array into type and data
    opType = op[0]
    opData = op[1]
    if opType == 'comment_benefactor_reward':
        process_benefactor_reward(opData, tx)

def collapse_votes(votes):
    collapsed = []
    # Convert time to timestamps
    for key, vote in enumerate(votes):
        votes[key]['time'] = int(datetime.strptime(
            votes[key]['time'], '%Y-%m-%dT%H:%M:%S').strftime('%s'))
    # Sort based on time
    sortedVotes = sorted(votes, key=lambda k: k['time'])
    # Iterate and append to return value
    for vote in votes:
        collapsed.append([
            vote['voter'],
            vote['percent']
        ])
    return collapsed


def process_benefactor_reward(opData, tx):
    _id = opData['author'] + '/' + opData['permlink']
    content_type = 'unknown'
    try:
        # Load the post now that it processed rewards
        comment = load_post(_id, opData['author'], opData['permlink'])
        if comment['parent_author'] == '':
            post = db.posts.find_one({'_id': _id})
            content_type = 'post'
        # Otherwise save it into the `replies` collection and update the parent
        else:
            # Update this post within the `replies` collection
            post = db.replies.find_one({'_id': _id})
            content_type = 'reply'
        if post:
            # Determine the namespace
            namespace = post['namespace'] if 'namespace' in post else post['root_namespace'] if 'root_namespace' in post else False
            # Calculate the reward values
            platform_payout_vests = float("%.6f" % float(opData['reward'].split(' ')[0]))
            platform_payout_steem = float("%.3f" % c.vests_to_sp(platform_payout_vests))
            platform_payout = float("%.3f" % (platform_payout_steem * c.sbd_median_price()))
            doc = {
                'author': opData['author'],
                'author_payout': comment['total_payout_value'],
                'category': comment['category'],
                'curator_payout': comment['curator_payout_value'],
                'height': tx['block'],
                'ns': namespace,
                'permlink': opData['permlink'],
                'platform_payout': platform_payout,
                'platform_payout_vests': platform_payout_vests,
                'sbd_value': platform_payout,
                'steem_value': platform_payout_steem,
                'timestamp': comment['last_payout'],
                'title': comment['title'] if comment['title'] else comment['root_title'] if comment['root_title'] else '',
                'type': content_type,
                'txid': tx['trx_id'],
            }
            # Add the reward to the database
            db.rewards.update({'_id': _id}, {'$set': doc}, upsert=True)
            # Also add to funding
            if namespace:
                db.funding.update({'_id': _id}, {'$set': doc}, upsert=True)

    except:
        l('Error parsing post')
        l(comment)
        pass


def load_post(_id, author, permlink):
    # Fetch from the rpc
    comment = s.get_content(author, permlink).copy()

    # Add our ID and collapse the votes
    comment.update({
        '_id': _id,
        'active_votes': collapse_votes(comment['active_votes']),
    })

    # Remap into our storage format
    for key in ['abs_rshares', 'children_rshares2', 'net_rshares', 'children_abs_rshares', 'vote_rshares', 'total_vote_weight', 'root_comment', 'promoted', 'max_cashout_time', 'body_length', 'reblogged_by', 'replies']:
        comment.pop(key, None)
    for key in ['author_reputation']:
        comment[key] = float(comment[key])
    for key in ['total_pending_payout_value', 'pending_payout_value', 'max_accepted_payout', 'total_payout_value', 'curator_payout_value']:
        comment[key] = float(comment[key].split()[0])
    for key in ['active', 'created', 'cashout_time', 'last_payout', 'last_update']:
        comment[key] = datetime.strptime(comment[key], '%Y-%m-%dT%H:%M:%S')
    for key in ['json_metadata']:
        try:
            comment[key] = json.loads(comment[key])
        except ValueError:
            comment[key] = comment[key]

    # Update the post in the DB since we have it
    # If this is a top level post, update the `posts` collection
    if comment['parent_author'] == '':
        db.posts.update({'_id': _id}, {'$set': comment}, upsert=True)
    # Otherwise save it into the `replies` collection and update the parent
    else:
        # Update this post within the `replies` collection
        db.replies.update({'_id': _id}, {'$set': comment}, upsert=True)

    return comment

def process_platform_history():
    l('platform account')
    moreops = True
    limit = 100
    # How many history ops have been processed previously?
    init = db.status.find_one({'_id': 'history_processed'})
    if(init):
        last_op_processed = int(init['value'])
    else:
        last_op_processed = limit
    while moreops:
        ops = s.get_account_history(ns, last_op_processed + 100, limit)
        if ops[-1][0] == last_op_processed:
            moreops = False
        for idx, op in ops:
            l("History height processing: {}".format(idx))
            if idx > last_op_processed:
                if op['op'][0] in ['comment_benefactor_reward']:
                    process_op(op['op'], op)
                last_op_processed = idx
                db.status.update({'_id': 'history_processed'}, {'$set': {'value': idx}}, upsert=True)

if __name__ == '__main__':
    l('starting')

    process_platform_history()

    scheduler = BackgroundScheduler()
    scheduler.add_job(process_platform_history, 'interval', minutes=10, id='process_platform_history')
    scheduler.start()

    while True:
        time.sleep(30)

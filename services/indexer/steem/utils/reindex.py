from datetime import datetime, timedelta
from steem import Steem
from pymongo import MongoClient
from pprint import pprint
import collections
import json
import time
import sys
import os

# Connections
nodes = [
    'https://steemd.steemit.com'
]
s = Steem(nodes)
mongo = MongoClient("mongodb://mongo")
db = mongo.forums

data = json.loads(sys.argv[1])

def update_forum(data):
    if 'parent' in data:
        parent = db.forums.find_one({'_id': data['parent']})
        data.update({
          'parent_name': parent['name']
        })
    query = {
        '_id': data['_id']
    }
    results = db.forums.update(query, {'$set': data}, upsert=True)
    if results['n'] == 1 and results['updatedExisting'] == False:
        pprint("[FORUM][REINDEXER] - Inserting new forum [" + data['_id'] + "]")
    if results['n'] == 1 and results['updatedExisting'] == True:
        pprint("[FORUM][REINDEXER] - Updating forum [" + data['_id'] + "]")

def update_posts(data):
    query = {}
    if 'tags' in data and len(data['tags']) > 0:
        query.update({'category': {'$in': data['tags']}})
    if 'accounts' in data and len(data['accounts']) > 0:
        query.update({'author': {'$in': data['accounts']}})
    sort = [("last_reply",-1),("created",-1)]
    results = db.posts.find(query).sort(sort).limit(1)
    for comment in results:
        query = {
            '_id': data['_id'],
        }
        updates = {
            'updated': comment['created'],
            'last_post': {
                'created': comment['created'],
                'author': comment['author'],
                'title': comment['title'],
                'url': comment['url']
            }
        }
        pprint("[FORUM][REINDEXER] - Updating latest post to [" + str(comment['_id']) + "]...")
        response = db.forums.update(query, {'$set': updates}, upsert=True)

def update_replies(data):
    query = {}
    if 'tags' in data and len(data['tags']) > 0:
        query.update({'category': {'$in': data['tags']}})
    if 'accounts' in data and len(data['accounts']) > 0:
        query.update({'author': {'$in': data['accounts']}})
    sort = [("last_reply",-1),("created",-1)]
    results = db.replies.find(query).sort(sort).limit(1)
    for comment in results:
        query = {
            '_id': data['_id'],
        }
        updates = {
            'updated': comment['created'],
            'last_reply': {
                'created': comment['created'],
                'author': comment['author'],
                'title': comment['root_title'],
                'url': comment['url']
            }
        }
        pprint("[FORUM][REINDEXER] - Updating latest reply to [" + str(comment['_id']) + "]...")
        db.forums.update(query, {'$set': updates}, upsert=True)

def update_parent(data):
    db.forums.update({
        '_id': data['parent']
    }, {
        '$addToSet': {
            'children': {
                '_id': data['_id'],
                'name': data['name']
            }
        }
    })

if __name__ == '__main__':
    pprint("[FORUM][REINDEXER] - Starting script...")
    update_forum(data)
    update_posts(data)
    update_replies(data)
    if 'parent' in data:
        update_parent(data)

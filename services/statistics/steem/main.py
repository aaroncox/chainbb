from apscheduler.schedulers.background import BackgroundScheduler
from pprint import pprint
from pymongo import MongoClient
import time
import inspect
import sys
import os

ns = os.environ['namespace'] if 'namespace' in os.environ else 'chainbb'
mongo = MongoClient("mongodb://mongo")
db = mongo[ns]


def l(msg):
    caller = inspect.stack()[1][3]
    print("[FORUM][STATISTICS][{}] {}".format(str(caller), str(msg)))


def update_statistics():
    # l("Updating stats for all forums...")
    forums = db.forums.find()
    for forum in forums:
        l(forum['_id'])
        update_forum(forum)

def update_statistics_queue():
    # l("Updating stats for next queued forum...")
    forums = db.forums.find({'_update': True}).limit(5)
    for forum in forums:
        l(forum['_id'])
        update_forum(forum)

def update_forum(forum):
    update_forum_funding(forum)
    update_forum_stats(forum)
    update_latest_content(forum)

def update_latest_content(forum):
    update_latest_post(forum)
    update_latest_reply(forum)

def update_forum_funding(forum):
    _id = forum['_id']
    total = list(db.funding.aggregate([
        {'$match': {'ns': _id}},
        {'$group': {'_id': 'total', 'amount': {'$sum': '$steem_value'}}}
    ]))
    if len(total) > 0:
        total = float("%.3f" % total[0]['amount'])
        db.forums.update({'_id': _id}, {'$set': {'funded': total}})

def update_latest_post(forum):
    if 'exclusive' in forum and forum['exclusive'] == True:
        query = {
            'namespace': forum['_id'],
            '_removedFrom': {'$ne': forum['_id']}
        }
    else:
        if 'tags' not in forum:
            return
        query = {
            'category': {'$in': forum['tags']},
            '_removedFrom': {'$nin': forum['tags']}
        }
    sort = [('created', -1)]
    results = list(db.posts.find(query).sort(sort).limit(1))
    query = {
        '_id': forum['_id'],
    }
    if len(results) > 0:
        comment = results[0]
        updates = {
            'updated': comment['created'],
            'last_post': {
                'created': comment['created'],
                'author': comment['author'],
                'title': comment['title'],
                'url': comment['url']
            }
        }
    else:
        updates = {
            'last_post': {}
        }
    results = db.forums.update(query, {'$set': updates})


def update_latest_reply(forum):
    if 'exclusive' in forum and forum['exclusive'] == True:
        query = {
            'root_namespace': forum['_id'],
            '_removedFrom': {'$ne': forum['_id']}
        }
    else:
        if 'tags' not in forum:
            return
        query = {
            'category': {'$in': forum['tags']},
            '_removedFrom': {'$nin': forum['tags']}
        }
    sort = [('created', -1)]
    results = list(db.replies.find(query).sort(sort).limit(1))
    query = {
        '_id': forum['_id'],
    }
    if len(results) > 0:
        comment = results[0]
        updates = {
            'updated': comment['created'],
            'last_reply': {
                'created': comment['created'],
                'author': comment['author'],
                'title': comment['root_title'],
                'url': comment['url']
            }
        }
    else:
        updates = {
            'last_reply': {}
        }
    results = db.forums.update(query, {'$set': updates})

def update_forum_stats(forum):
    if ('tags' in forum):
        if 'exclusive' in forum and forum['exclusive']:
            stats = {
                'posts': get_post_count(namespace=forum['_id']),
                'replies': get_reply_count(namespace=forum['_id'])
            }
        else:
            stats = {
                'posts': get_post_count(tags=forum['tags']),
                'replies': get_reply_count(tags=forum['tags'])
            }
        db.forums.update({'_id': forum['_id']}, {'$set': {'stats': stats}, '$unset': {'_update': True}})


def get_post_count(tags=[], namespace=False):
    if namespace:
        return db.posts.count({
            'namespace': namespace,
            '_removedFrom': {'$ne': namespace},
        })
    return db.posts.count({
        'category': {'$in': tags},
        '_removedFrom': {'$nin': tags},
    })


def get_reply_count(tags=[], namespace=False):
    if namespace:
        return db.replies.count({
            'root_namespace': namespace,
            '_removedFrom': {'$ne': namespace},
        })
    return db.replies.count({
        'category': {'$in': tags},
        '_removedFrom': {'$nin': tags},
    })

def rebuild_activeusers_cache():
    results = db.activeusers.aggregate([
        {'$unwind': '$app'},
        {'$group': {
            '_id': '$app',
            'sum': {'$sum': 1}
        }},
        {'$sort': {
            'sum': -1
        }}
    ])
    users = {doc["_id"].replace('.', '-'): doc['sum'] for doc in results}
    db.stats.update({
        '_id': 'users-24h'
    }, {
        '$set': {
            'total': sum(users.values()),
            'platforms': users,
        }
    }, upsert=True)

if __name__ == '__main__':
    l("starting service")
    update_statistics()
    rebuild_activeusers_cache()
    scheduler = BackgroundScheduler()
    scheduler.add_job(rebuild_activeusers_cache, 'interval', minutes=1, id='rebuild_activeusers_cache')
    scheduler.add_job(update_statistics, 'interval', hours=1, id='update_statistics')
    scheduler.add_job(update_statistics_queue, 'interval', seconds=15, id='update_statistics_queue')
    scheduler.start()
    # Loop
    try:
        while True:
            time.sleep(2)
    except (KeyboardInterrupt, SystemExit):
        scheduler.shutdown()

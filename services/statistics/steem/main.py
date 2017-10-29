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
    l("Updating stats for all forums...")
    forums = db.forums.find()
    for forum in forums:
        l(forum['_id'])
        if ('tags' in forum):
            if 'exclusive' in forum and forum['exclusive']:
                stats = {
                    'posts': get_post_count(namespace=forum['_id']),
                    'replies': get_reply_count(namespace=forum['_id'])
                }
                l("{} - {}".format(forum['_id'], stats))
            else:
                stats = {
                    'posts': get_post_count(tags=forum['tags']),
                    'replies': get_reply_count(tags=forum['tags'])
                }
            db.forums.update({'_id': forum['_id']}, {'$set': {'stats': stats}})

def update_statistics_queue():
    l("Updating stats for next queued forum...")
    forums = db.forums.find({'_update': True}).limit(5)
    for forum in forums:
        l(forum['_id'])
        if ('tags' in forum):
            if 'exclusive' in forum and forum['exclusive']:
                stats = {
                    'posts': get_post_count(namespace=forum['_id']),
                    'replies': get_reply_count(namespace=forum['_id'])
                }
                l("{} - {}".format(forum['_id'], stats))
            else:
                stats = {
                    'posts': get_post_count(tags=forum['tags']),
                    'replies': get_reply_count(tags=forum['tags'])
                }
            db.forums.update({'_id': forum['_id']}, {'$set': {'stats': stats}, '$unset': {'_update': True}})


def get_post_count(tags=[], namespace=False):
    if namespace:
        return db.posts.count({'namespace': namespace})
    return db.posts.count({'category': {'$in': tags}})


def get_reply_count(tags=[], namespace=False):
    if namespace:
        return db.replies.count({'root_namespace': namespace})
    return db.replies.count({'category': {'$in': tags}})


if __name__ == '__main__':
    l("starting service")
    update_statistics()
    scheduler = BackgroundScheduler()
    scheduler.add_job(update_statistics, 'interval',
                      hours=1, id='update_statistics')
    scheduler.add_job(update_statistics_queue, 'interval',
                      minutes=5, id='update_statistics_queue')
    scheduler.start()
    # Loop
    try:
        while True:
            time.sleep(2)
    except (KeyboardInterrupt, SystemExit):
        scheduler.shutdown()

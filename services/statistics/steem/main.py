from apscheduler.schedulers.background import BackgroundScheduler
from pprint import pprint
from pymongo import MongoClient
import time
import inspect
import sys
import os

ns = os.environ['namespace'] if 'namespace' in os.environ else ''
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
      stats = {
        'posts': get_post_count(forum['tags']),
        'replies': get_reply_count(forum['tags'])
      }
      l(stats)
      db.forums.update({'_id': forum['_id']}, {'$set': {'stats': stats}})

def get_post_count(tags = []):
  return db.posts.count({'category': {'$in': tags}})

def get_reply_count(tags = []):
  return db.replies.count({'category': {'$in': tags}})

if __name__ == '__main__':
    l("Starting service")
    update_statistics()
    scheduler = BackgroundScheduler()
    scheduler.add_job(update_statistics, 'interval', hours=24, id='update_statistics')
    scheduler.start()
    # Loop
    try:
        while True:
            time.sleep(2)
    except (KeyboardInterrupt, SystemExit):
        scheduler.shutdown()

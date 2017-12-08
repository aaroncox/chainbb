from flask import Flask, jsonify, request
from pprint import pprint
from pymongo import MongoClient
from bson.json_util import dumps
from flask_cors import CORS, cross_origin
from mongodb_jsonencoder import MongoJsonEncoder
from steem import Steem
import os

ns = os.environ['namespace'] if 'namespace' in os.environ else 'chainbb'
mongo = MongoClient("mongodb://mongo", connect=False)
db = mongo[ns]

nodes = [
    os.environ['steem_node'] if 'steem_node' in os.environ else 'localhost:5090',
]
s = Steem(nodes)

app = Flask(__name__)
app.json_encoder = MongoJsonEncoder
CORS(app)


def response(json, forum=False, children=False, meta=False, status='ok'):
    # Load height
    # NYI - should be cached at for 3 seconds
    statuses = db.status.find()
    network = {}
    for doc in statuses:
        network.update({
            str(doc['_id']): doc['value']
        })
    response = {
        'status': status,
        'network': network,
        'data': json
    }
    if forum:
        response.update({
            'forum': forum
        })
    if children:
        response.update({
            'children': list(children)
        })
    if meta:
        response.update({
            'meta': meta
        })
    return jsonify(response)


def load_post(author, permlink):
    # Load the post by author/permlink
    query = {
        'author': author,
        'permlink': permlink
    }
    post = db.posts.find_one(query)
    if post and 'active_votes' in post:
        # A dict to store vote information
        votes = {}
        # Loop over current votes and add them to the new simple dict
        for vote in post['active_votes']:
            votes.update({vote[0]: vote[1]})
        # Remove old active_votes
        post.pop('active_votes', None)
        # Add the new simple votes
        post.update({
            'votes': votes
        })
    return post


def load_replies(query, sort):
    replies = []
    results = db.replies.find(query).sort(sort)
    for idx, post in enumerate(results):
        if post and 'active_votes' in post:
            # A dict to store vote information
            votes = {}
            # Loop over current votes and add them to the new simple dict
            for vote in post['active_votes']:
                votes.update({vote[0]: vote[1]})
            # Remove old active_votes
            post.pop('active_votes', None)
            # Add the new simple votes
            post.update({
                'votes': votes
            })
            replies.append(post)
    return replies


@app.route("/")
def index():
    query = {
        "group": {"$in": [
            "localtesting",  # localtesting never exists on live, only in dev
            "projects",
            "crypto",
            "community"
        ]}
    }
    sort = [("group_order", 1), ("forum_order", 1)]
    results = db.forums.find(query).sort(sort)
    appusers = db.activeusers.find({'app': ns}, {'_id': 1})
    return response({
        'forums': list(results),
        'users': {
            'stats': {
                'total': db.activeusers.count(),
                'app': db.activeusers.count({'app': ns}),
            },
            'list': list(appusers)
        }
    })


@app.route("/forums")
def forums():
    query = {}
    sort = [("highlight", -1), ("_id", 1), ("parent", 1)]
    results = db.forums.find(query).sort(sort)
    return response({
        'forums': list(results)
    })


@app.route("/@<username>")
def account(username):
    query = {
        'author': username
    }
    fields = {
        'author': 1,
        'category': 1,
        'created': 1,
        'children': 1,
        'json_metadata': 1,
        'last_reply': 1,
        'last_reply_by': 1,
        'permlink': 1,
        'title': 1,
        'url': 1
    }
    sort = [("created", -1)]
    page = int(request.args.get('page', 1))
    perPage = 20
    skip = (page - 1) * perPage
    limit = perPage
    total = db.posts.count(query)
    posts = db.posts.find(query, fields).sort(sort).skip(skip).limit(limit)
    return response({
        'posts': list(posts),
        'total': total,
        'page': page
    })


@app.route("/@<username>/replies")
def replies(username):
    sort = {"created": -1}
    page = int(request.args.get('page', 1))
    perPage = 10
    skip = (page - 1) * perPage
    limit = perPage
    pipeline = [
        {'$match': {
            'parent_author': username,
            'author': {'$ne': username},
        }},
        {'$sort': sort},
        {'$project': {
            'parent_id': {'$concat': ['$parent_author', '/', '$parent_permlink']},
            'reply': '$$ROOT'
        }},
        {'$lookup': {
            'from': 'posts',
            'localField': 'parent_id',
            'foreignField': '_id',
            'as': 'parent_post'
        }},
        {'$lookup': {
            'from': 'replies',
            'localField': 'parent_id',
            'foreignField': '_id',
            'as': 'parent_reply'
        }},
        {'$project': {
            'reply': 1,
            'parent': {
                '$cond': {
                    'if': {'$eq': ["$parent_reply", []]},
                    'then': '$parent_post',
                    'else': '$parent_reply'
                }
            }
        }},
        {'$unwind': '$parent'},
        {'$project': {
            'reply': {
                '_id': 1,
                'active_votes': 1,
                'author': 1,
                'body': 1,
                'category': 1,
                'created': 1,
                'depth': 1,
                'json_metadata': 1,
                'parent_author': 1,
                'parent_permlink': 1,
                'permlink': 1,
                'root_namespace': 1,
                'root_post': 1,
                'root_title': 1,
                'title': 1,
                'url': 1,
            },
            'parent': {
                '_id': 1,
                'active_votes': 1,
                'author': 1,
                'body': 1,
                'category': 1,
                'created': 1,
                'depth': 1,
                'parent_author': 1,
                'parent_permlink': 1,
                'permlink': 1,
                'namespace': 1,
                'root_namespace': 1,
                'root_title': 1,
                'title': 1,
                'url': 1,
            }
        }},
        {'$limit': limit + skip},
        {'$skip': skip},
    ]
    total = db.replies.count({'parent_author': username})
    replies = db.replies.aggregate(pipeline)
    results = []
    for idx, reply in enumerate(replies):
        # Format parent votes
        parent_votes = {}
        for vote in reply['parent']['active_votes']:
            parent_votes.update({vote[0]: vote[1]})
        reply['parent'].pop('active_votes', None)
        reply['parent'].update({
            'votes': parent_votes
        })
        # Format reply votes
        reply_votes = {}
        for vote in reply['reply']['active_votes']:
            reply_votes.update({vote[0]: vote[1]})
        reply['reply'].pop('active_votes', None)
        reply['reply'].update({
            'votes': reply_votes
        })
        # Temporary way to retrieve forum
        if 'root_namespace' in reply['reply']:
            reply['forum'] = db.forums.find_one({
                '_id': reply['reply']['root_namespace']
            }, {
                '_id': 1,
                'creator': 1,
                'exclusive': 1,
                'funded': 1,
                'name': 1,
                'tags': 1,
            })
        results.append(reply)
    return response({
        'replies': results,
        'total': total,
        'page': page,
    })


@app.route("/@<username>/responses")
def accountResponses(username):
    query = {
        'author': username
    }
    fields = {
        'author': 1,
        'category': 1,
        'created': 1,
        'children': 1,
        'json_metadata': 1,
        'last_reply': 1,
        'last_reply_by': 1,
        'parent_author': 1,
        'parent_permlink': 1,
        'permlink': 1,
        'root_post': 1,
        'root_title': 1,
        'url': 1
    }
    sort = [("created", -1)]
    page = int(request.args.get('page', 1))
    perPage = 20
    skip = (page - 1) * perPage
    limit = perPage
    total = db.replies.count(query)
    responses = db.replies.find(query, fields).sort(
        sort).skip(skip).limit(limit)
    return response({
        'responses': list(responses),
        'total': total,
        'page': page
    })


@app.route("/tags")
def tags():
    query = {}
    sort = [("last_reply", -1)]
    results = db.topics.find(query).sort(sort)
    return response(list(results))


@app.route("/search")
def search():
    pipeline = [
        {
            '$match': {
                '$text': {
                    '$search': request.args.get('q')
                }
            }
        },
        {
            '$sort': {
                'score': {
                    '$meta': "textScore"
                }
            }
        },
        {
            '$project': {
                'title': '$title',
                'description': '$url'
            }
        },
        {
            '$limit': 5
        }
    ]
    results = db.posts.aggregate(pipeline)
    return response(list(results))


@app.route('/forum/<slug>')
def forum(slug):
    # Load the specified forum
    query = {
        '_id': slug
    }
    forum = db.forums.find_one(query)
    # No forum? Look for a reservation
    if not forum:
        reservation = db.forum_requests.find_one(query)
        return response({}, meta={'reservation': reservation}, status='not-found')
    # No tags or authors? It's unconfigured
    if 'tags' not in forum and 'accounts' not in forum:
        return response(list(), forum=forum, meta={'configured': False})
    # Load children forums
    query = {
        'parent': str(forum['_id'])
    }
    children = db.forums.find(query)
    # Load the posts
    query = {}
    # ?filter=all will allow display of all posts
    postFilter = request.args.get('filter', False)
    if postFilter != 'all':
        query['_removedFrom'] = {
            '$nin': [slug]
        }
    if 'tags' in forum and len(forum['tags']) > 0:
        query.update({
            'category': {
                '$in': forum['tags']
            }
        })
    if 'accounts' in forum and len(forum['accounts']) > 0:
        query.update({
            'author': {
                '$in': forum['accounts']
            }
        })
    if postFilter != False and postFilter != 'all':
        query.update({
            'category': postFilter
        })
    if 'exclusive' in forum and forum['exclusive'] == True:
        if postFilter == False and postFilter == 'all':
            query.pop('category', None)
        query.update({'namespace': slug})
    # If we have an empty query, it's an unconfigured forum
    fields = {
        'author': 1,
        'category': 1,
        'cbb': 1,
        'created': 1,
        'children': 1,
        'funded': 1,
        'json_metadata': 1,
        'last_reply': 1,
        'last_reply_by': 1,
        'last_reply_url': 1,
        'max_accepted_payout': 1,
        'percent_steem_dollars': 1,
        'permlink': 1,
        'title': 1,
        'url': 1
    }
    # ?filter=all should also display the _removedFrom field
    if postFilter == 'all':
        fields['_removedFrom'] = 1
    sort = [("active", -1)]
    page = int(request.args.get('page', 1))
    perPage = 20
    skip = (page - 1) * perPage
    limit = perPage
    results = db.posts.find(query, fields).sort(sort).skip(skip).limit(limit)
    return response(list(results), forum=forum, children=children, meta={'query': query, 'sort': sort})

@app.route('/status/<slug>')
def status(slug):
    # Load the specified forum
    query = {
        '_id': slug
    }
    forum = db.forums.find_one(query)
    # And those who funded it
    query = {
        'ns': slug
    }
    funding = db.funding.find(query).sort([('timestamp', -1)])
    # Total contributions
    contributions = db.funding.aggregate([
        {'$match': {'ns': slug}},
        {'$group': {'_id': '$from', 'count': {'$sum': 1}, 'total': {'$sum': '$steem_value'}}},
        {'$sort': {'total': -1}}
    ])
    return response({
        'history': list(funding),
        'contributors': list(contributions)
    }, forum=forum)

@app.route('/topics/<category>')
def topics(category):
    query = {
        'category': category
    }
    fields = {
        'author': 1,
        'created': 1,
        'json_metadata': 1,
        'last_reply': 1,
        'last_reply_by': 1,
        'permlink': 1,
        'title': 1,
        'url': 1
    }
    sort = [("last_reply", -1), ("created", -1)]
    results = db.posts.find(query, fields).sort(sort).limit(20)
    return response(list(results))


@app.route('/<category>/@<author>/<permlink>')
def post(category, author, permlink):
    # Load the specified post
    post = load_post(author, permlink)
    if post:
        # Load the specified forum
        query = {
            'tags': {'$in': [post['category']]}
        }
        forum = db.forums.find_one(query)
        return response(post, forum=forum)
    else:
        post = s.get_content(author, permlink).copy()
        return response(post)


@app.route('/<category>/@<author>/<permlink>/responses')
def responses(category, author, permlink):
    query = {
        'root_post': author + '/' + permlink
    }
    sort = [
        ('created', 1)
    ]
    return response(list(load_replies(query, sort)))


@app.route('/active')
def active():
    query = {

    }
    fields = {
        'author': 1,
        'category': 1,
        'children': 1,
        'created': 1,
        'last_reply': 1,
        'last_reply_by': 1,
        'permlink': 1,
        'title': 1,
        'url': 1
    }
    sort = [("last_reply", -1), ("created", -1)]
    limit = 20
    results = db.posts.find(query, fields).sort(sort).limit(limit)
    return response(list(results))

@app.route('/api/ns_lookup')
def ns_lookup():
    ns = request.args.get('ns', False)
    query = {
        '_id': ns
    }
    forums = db.forums.find_one(query)
    requests = db.forum_requests.find_one(query)
    return response({
        'exists': bool(forums or requests)
    })

@app.route('/height')
def height():
    query = {
        '_id': 'height'
    }
    return response(db.status.find_one(query))


@app.route("/config")
def config():
    results = db.forums.find()
    return response(list(results))

@app.route("/platforms")
def platforms():
    return response(db.stats.find_one({
        '_id': 'users-24h'
    }))

if __name__ == "__main__":
    app.run(host='0.0.0.0', debug=True)

db.posts.createIndex({category: 1}, { sparse: true });
db.posts.createIndex({author: 1, permlink: 1});
db.posts.createIndex({category: 1, last_reply: 1, created: 1});

db.replies.createIndex({category: 1}, { sparse: true });
db.replies.createIndex({root_post: 1, created: 1});

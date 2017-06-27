import * as types from './actionTypes';

export function forumSubscribe(forum) {
  return {
    forum: forum,
    type: types.FORUM_SUBSCRIBE
  }
}

export function forumUnsubscribe(forum) {
  return {
    forum: forum,
    type: types.FORUM_UNSUBSCRIBE
  }
}

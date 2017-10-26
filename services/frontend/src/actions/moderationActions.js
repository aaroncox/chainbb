import * as types from './actionTypes';
import steem from 'steem'

export function moderatorRemoveTopicForum(moderator, topic, forum) {
  return (dispatch: () => void) => {
    const { key, name } = moderator
    const id = 'chainbb'
    let json = ['moderate_post']
    json.push({
      forum: forum['_id'],
      topic: topic['_id'],
      remove: true,
    })
    dispatch({
      type: types.MODERATION_REMOVE_PROCESSING,
      payload: json,
      loading: true
    })
    steem.broadcast.customJson(key, [], [name], id, JSON.stringify(json), function(err, result) {
      if(result) {
        dispatch({
          type: types.MODERATION_REMOVE_RESOLVED,
          payload: json,
          loading: false
        })
      }
      if(err) {
        dispatch({
          type: types.MODERATION_REMOVE_RESOLVED_ERROR,
          payload: json,
          loading: false
        })
      }
    });
  };
}

export function moderatorRestoreTopicForum(moderator, topic, forum) {
  return (dispatch: () => void) => {
    const { key, name } = moderator
    const id = 'chainbb'
    let json = ['modpost']
    json.push({
      forum: forum['_id'],
      topic: topic['_id'],
      remove: false,
    })
    dispatch({
      type: types.MODERATION_RESTORE_PROCESSING,
      payload: json,
      loading: true
    })
    steem.broadcast.customJson(key, [], [name], id, JSON.stringify(json), function(err, result) {
      if(result) {
        dispatch({
          type: types.MODERATION_RESTORE_RESOLVED,
          payload: json,
          loading: false
        })
      }
      if(err) {
        dispatch({
          type: types.MODERATION_RESTORE_RESOLVED_ERROR,
          payload: json,
          loading: false
        })
      }
    });
  };
}

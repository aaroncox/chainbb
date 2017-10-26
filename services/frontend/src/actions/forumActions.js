import * as types from './actionTypes';
import axios from 'axios'
import steem from 'steem'
import * as GLOBAL from '../global';
import * as statusActions from './statusActions'

export function forumReservation(account, name, namespace) {
  return (dispatch: () => void) => {
    const id = 'chainbb'
    let json = ['forum_reserve']
    json.push({
        name,
        namespace,
    })
    dispatch({
      type: types.FORUM_RESERVATION_PROCESSING,
      payload: json,
    })
    // setTimeout(function() {
    //     dispatch({
    //       type: types.FORUM_RESERVATION_RESOLVED,
    //       payload: json,
    //     })
    // }, 2000)
    steem.broadcast.customJson(account.key, [], [account.name], id, JSON.stringify(json), function(err, result) {
      if(result) {
        dispatch({
          type: types.FORUM_RESERVATION_RESOLVED,
          payload: json,
        })
      }
      if(err) {
        dispatch({
          type: types.FORUM_RESERVATION_RESOLVED_ERROR,
          payload: json,
        })
      }
    });
  };
}

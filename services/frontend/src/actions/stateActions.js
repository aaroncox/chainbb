import * as types from './actionTypes';
import steem from 'steem'

export function getState(path) {
  return dispatch => {
    steem.api.getState(path, function(err, data) {
      dispatch(getStateResolved(data))
    })
  }
}

export function getStateResolved(payload) {
  return {
    type: types.STATE_RESOLVED,
    payload: payload
  }
}

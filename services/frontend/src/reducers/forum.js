import * as types from '../actions/actionTypes';
import _ from 'lodash'

export default function forum(state = {last: null}, action) {
  switch(action.type) {
    case types.FORUM_LOAD_RESOLVED:
      return Object.assign({}, state, {
          target: action.payload.forum,
          funding: {
              'history': (action.payload.data && action.payload.data.history) ? action.payload.data.history : [],
              'contributors': (action.payload.data && action.payload.data.contributors) ? action.payload.data.contributors : [],
          }
      })
    case types.FORUM_CONFIG_PROCESSING:
    case types.FORUM_CONFIG_RESOLVED:
    case types.FORUM_CONFIG_RESOLVED_ERROR:
    case types.FORUM_RESERVATION_PROCESSING:
    case types.FORUM_RESERVATION_RESOLVED:
    case types.FORUM_RESERVATION_RESOLVED_ERROR:
      return Object.assign({}, state, {last: action})
    default:
      return state
  }
}

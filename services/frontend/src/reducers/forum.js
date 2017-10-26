import * as types from '../actions/actionTypes';
import _ from 'lodash'

export default function forum(state = {last: null}, action) {
  switch(action.type) {
    case types.FORUM_RESERVATION_PROCESSING:
    case types.FORUM_RESERVATION_RESOLVED:
    case types.FORUM_RESERVATION_RESOLVED_ERROR:
      return Object.assign({}, state, {last: action})
    default:
      return state
  }
}

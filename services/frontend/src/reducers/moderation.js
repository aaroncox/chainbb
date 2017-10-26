import * as types from '../actions/actionTypes';
import _ from 'lodash'

export default function moderation(state = {last: null}, action) {
  switch(action.type) {
    case types.MODERATION_REMOVE_PROCESSING:
    case types.MODERATION_REMOVE_RESOLVED:
    case types.MODERATION_REMOVE_RESOLVED_ERROR:
    case types.MODERATION_RESTORE_PROCESSING:
    case types.MODERATION_RESTORE_RESOLVED:
    case types.MODERATION_RESTORE_RESOLVED_ERROR:
      return Object.assign({}, state, {last: action})
    default:
      return state
  }
}

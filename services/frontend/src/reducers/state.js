import * as types from '../actions/actionTypes';

export default function state(state = false, action) {
  switch(action.type) {
    case types.STATE_RESOLVED:
      return Object.assign({}, state, action.payload)
    default:
      return state
  }
}

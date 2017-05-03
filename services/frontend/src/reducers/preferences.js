import * as types from '../actions/actionTypes';
import store from 'store'

const initialPreferences = {
  votePowerPost: 100,
  votePowerComment: 100,
  threadPostsPerPage: 10
}

export default function preferences(state = false, action) {
  // Load from localStorage as default, or initialPreferences
  if(state === false) {
    let prefs = store.get('preferences')
    if(!prefs) {
      prefs = initialPreferences
    }
    return Object.assign({}, state, prefs)
  }
  switch(action.type) {
    case types.SET_PREFERENCE:
      let newState = Object.assign({}, state, action.payload)
      store.set('preferences', newState)
      return newState
    default:
      return state
  }
}

export const getPreference = (state, key) => {
  return state[key]
}

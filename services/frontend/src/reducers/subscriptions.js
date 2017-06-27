import * as types from '../actions/actionTypes';
import store from 'store'

export default function subscriptions(state = false, action) {
  // Load from localStorage as default, or initialPreferences
  if(state === false) {
    const existing = store.get('subscriptions')
    return Object.assign({}, existing || {forums: {}})
  }
  const { forum } = action
  if(forum) {
    const id = forum._id
    const newState = Object.assign({}, state)
    const forums = newState.forums
    switch(action.type) {
      case types.FORUM_SUBSCRIBE:
        if(!forums.hasOwnProperty(id)) {
          forums[id] = {
            id,
            name: forum['name'],
            parent: forum['parent'],
            parent_name: forum['parent_name'],
          }
        }
        store.set('subscriptions', newState)
        return newState
      case types.FORUM_UNSUBSCRIBE:
        if(forums.hasOwnProperty(id)) {
          delete forums[id]
        }
        store.set('subscriptions', newState)
        return newState
      default:
        return state
    }
  }
  return state
}

import * as types from '../actions/actionTypes';
import store from 'store'

export default function account(state = false, action) {
  // Load from localStorage as default
  switch(action.type) {
    case types.ACCOUNT_SIGNOUT:
      // Remove from localStorage
      store.remove('account')
      store.remove('key')
      // Update State
      return Object.assign({}, state, {
        isUser: false,
        name: '',
        key: ''
      })
    case types.ACCOUNT_SIGNIN:
      // Remove from localStorage
      store.set('account', action.payload.account)
      store.set('key', action.payload.key)
      // Update State
      return Object.assign({}, state, {
        isUser: (typeof store.get('account') !== 'undefined'),
        name: store.get('account'),
        key: store.get('key'),
        data: action.payload.data
      })
    case types.ACCOUNT_FETCH:
      return action.payload
    default:
      return state
  }
}

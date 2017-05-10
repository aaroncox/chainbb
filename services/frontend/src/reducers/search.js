import * as types from '../actions/actionTypes';

const initialState = {
  isLoading: false,
  results: [],
}

export default function post(state = initialState, action) {
  switch(action.type) {
    case types.SEARCH:
      return Object.assign({}, state, {
        isLoading: true
      })
    case types.SEARCH_RESOLVED:
      return Object.assign({}, state, {
        isLoading: false,
        results: action.payload
      })
    default:
      return state
  }
}

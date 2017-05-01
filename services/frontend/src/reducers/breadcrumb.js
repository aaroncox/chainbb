import * as types from '../actions/actionTypes';

const initialState = {
  trail: [{
    name: 'Forums',
    link: '/'
  }]
}

export default function breadcrumb(state = initialState, action) {
  switch(action.type) {
    case types.SET_BREADCRUMB:
      let payload = action.payload,
          trail = initialState.trail.concat(payload)
      return Object.assign({}, state, {
        trail: trail
      })
    default:
      return state
  }
}

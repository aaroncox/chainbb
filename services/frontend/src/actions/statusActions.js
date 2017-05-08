import * as types from './actionTypes';

export function setStatus(payload) {
  return {
    type: types.SET_STATUS,
    payload: payload
  }
}

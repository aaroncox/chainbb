import * as types from './actionTypes';

export function setPreference(payload) {
  return {
    type: types.SET_PREFERENCE,
    payload: payload
  }
}

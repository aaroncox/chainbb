import * as types from './actionTypes';

export function setBreadcrumb(payload) {
  return {type: types.SET_BREADCRUMB, payload: payload}
}

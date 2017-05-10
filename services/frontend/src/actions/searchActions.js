import * as types from './actionTypes';
import * as GLOBAL from '../global';

export function search(query) {
  return async dispatch => {
    const response = await fetch(`${ GLOBAL.REST_API }/search?q=${query}`);
    if (response.ok) {
      const result = await response.json();
      const searchResults = result.data.map((item) => {
        return {title: item.title, description: item.description}
      });
      dispatch(searchResolved(searchResults))
    } else {
      console.error(response.status);
      dispatch(searchResolved())
    }
  }
}

export function searchResolved(payload = {}) {
  return {
    type: types.SEARCH_RESOLVED,
    payload: payload
  }
}

export function searchBegin() {
  return {
    type: types.SEARCH
  }
}

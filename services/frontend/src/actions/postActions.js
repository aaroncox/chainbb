import * as types from './actionTypes';
import * as GLOBAL from '../global';
import steem from 'steem'

export function setVoteProcessing(id) {
  return {
    type: types.POST_VOTE_PROCESSING,
    payload: id
  }
}

export function castVote(payload) {
  return async dispatch => {
    const { author, permlink, weight } = payload,
          { key, name } = payload.account
    steem.broadcast.vote(key, name, author, permlink, weight, function(err, result) {
      if(err) {
        dispatch(castVoteResolvedError({
          error: err,
          payload: payload
        }))
      } else {
        dispatch(castVoteResolved(payload))
      }
    })
  }
}

export function castVoteResolved(payload) {
  return {
    type: types.POST_VOTE_RESOLVED,
    payload: payload
  }
}

export function castVoteResolvedError(response) {
  return {
    type: types.POST_VOTE_RESOLVED_ERROR,
    response: response
  }
}

export function fetchPostResolved(payload = {}) {
  return {
    type: types.POST_LOAD_RESOLVED,
    payload: payload
  }
}

export function fetchPost(params) {
  return async dispatch => {
    const { category, author, permlink } = params;
    const response = await fetch(`${ GLOBAL.REST_API }/${ category }/@${ author }/${ permlink }`);
    if (response.ok) {
      const result = await response.json()
      let payload = {
        breadcrumb: [{
          name: result.data.title,
          link: result.data.url
        }],
        forum: result.forum,
        content: result.data
      }
      if(result.forum) {
        payload.breadcrumb.unshift({
          name: result.forum.name,
          link: `/forum/${result.forum._id}`
        })
      }
      dispatch({
        type: types.SET_STATUS,
        payload: {
          network: result.network
        }
      })
      dispatch(fetchPostResolved(payload))
    } else {
      console.error(response.status);
      dispatch(fetchPostResolved())
    }
  }
}

export function fetchPostResponsesResolved(payload = {}) {
  return {
    type: types.POST_LOAD_RESPONSES_RESOLVED,
    payload: payload
  }
}

export function fetchPostResponses(params) {
  return async dispatch => {
    const { category, author, permlink } = params;
    const response = await fetch(`${ GLOBAL.REST_API }/${ category }/@${ author }/${ permlink }/responses`);
    if (response.ok) {
      const result = await response.json();
      dispatch(fetchPostResponsesResolved(result.data))
    } else {
      console.error(response.status);
      dispatch(fetchPostResponsesResolved())
    }
  }
}

export function resetPostState() {
  return {
    type: types.POST_RESET_STATE
  }
}

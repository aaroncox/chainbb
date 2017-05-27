import steem from 'steem'

import * as types from './actionTypes';
import * as BreadcrumbActions from './breadcrumbActions';
import * as GLOBAL from '../global';

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
      const result = await response.json();
      const trail = [{
        name: result.data.title,
        link: result.data.url
      }];
      if(result.forum) {
        trail.unshift({
          name: result.forum.name,
          link: `/forum/${result.forum._id}`
        })
      }
      dispatch(BreadcrumbActions.setBreadcrumb(trail));
      dispatch({
        type: types.SET_STATUS,
        payload: {
          network: result.network
        }
      })
      dispatch(fetchPostResolved({
        forum: result.forum,
        content: result.data
      }))
    } else {
      console.error(response.status);
      dispatch(fetchPostResolved())
    }
  }
}

export function fetchPostByAuthorResolved(payload = {}) {
  return {
    type: types.POST_LOAD_BY_AUTHOR_RESOLVED,
    payload: payload
  }
}

export function fetchPostByAuthor(author, page = 1) {
  return async dispatch => {
    let uri = `${ GLOBAL.REST_API }/@${ author }`;
    if (page > 1) {
      uri = uri + '?page=' + page;
    }
    const response = await fetch(uri);
    if (response.ok) {
      const result = await response.json();
      dispatch({
        type: types.SET_STATUS,
        payload: {
          network: result.network
        }
      })
      dispatch(fetchPostByAuthorResolved({
        account: author,
        posts: result.data.posts,
        totalPosts: result.data.total
      }))
    } else {
      console.error(response.status);
      dispatch(fetchPostByAuthorResolved())
    }
  }
}

export function fetchPostResponsesByAuthorResolved(payload = {}) {
  return {
    type: types.POST_LOAD_RESPONSES_BY_AUTHOR_RESOLVED,
    payload: payload
  }
}

export function fetchPostResponsesByAuthor(author, page = 1) {
  return async dispatch => {
    let uri = `${ GLOBAL.REST_API }/@${ author }/responses`;
    if (page > 1) {
      uri = uri + '?page=' + page;
    }
    const response = await fetch(uri);
    if (response.ok) {
      const result = await response.json();
      dispatch({
        type: types.SET_STATUS,
        payload: {
          network: result.network
        }
      })
      dispatch(fetchPostResponsesByAuthorResolved({
        account: author,
        responses: result.data.responses,
        totalResponses: result.data.total
      }))
    } else {
      console.error(response.status);
      dispatch(fetchPostResponsesByAuthorResolved())
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

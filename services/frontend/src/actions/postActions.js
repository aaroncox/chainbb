import steem from 'steem'
import slug from 'slug'

import * as types from './actionTypes';
import * as BreadcrumbActions from './breadcrumbActions';
import * as ForumActions from './forumActions';
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

export function clearVoteError(response) {
  return {
    type: types.POST_VOTE_RESOLVED_ERROR_CLEAR,
    response: response
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
          link: `/f/${result.forum._id}`
        })
      }
      dispatch(BreadcrumbActions.setBreadcrumb(trail));
      dispatch({
        type: types.SET_STATUS,
        payload: {
          network: result.network
        }
      })
      dispatch(ForumActions.setForum(result.forum))
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

export function fetchPostRepliesByAuthorResolved(payload = {}) {
  return {
    type: types.POST_LOAD_REPLIES_BY_AUTHOR_RESOLVED,
    payload: payload
  }
}

export function fetchPostRepliesByAuthorStarted(payload = {}) {
  return {
    type: types.POST_LOAD_REPLIES_BY_AUTHOR_STARTED,
    payload: payload
  }
}

export function fetchPostRepliesByAuthor(author, page = 1) {
  return async dispatch => {
    let uri = `${ GLOBAL.REST_API }/@${ author }/replies`;
    if (page > 1) {
      uri = uri + '?page=' + page;
    }
    const response = await fetch(uri);
    dispatch(fetchPostRepliesByAuthorStarted({
      account: author
    }))
    if (response.ok) {
      const result = await response.json();
      dispatch({
        type: types.SET_STATUS,
        payload: {
          network: result.network
        }
      })
      dispatch(fetchPostRepliesByAuthorResolved({
        account: author,
        replies: result.data.replies,
        totalReplies: result.data.total
      }))
    } else {
      console.error(response.status);
      dispatch(fetchPostRepliesByAuthorResolved())
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

export function generatePermlink(title, parent = null) {
  var permlink = '',
      date = new Date(),
      time = date.getFullYear().toString()+(date.getMonth()+1).toString()+date.getDate().toString()+"t"+date.getHours().toString()+date.getMinutes().toString()+date.getSeconds().toString()+date.getMilliseconds().toString()+"z"
  if(title && title.trim() !== '') {
    permlink = slug(title).toString()
  }
  if(parent) {
    permlink = "re-" + parent.author + "-" + parent.permlink + "-" + time;
  }
  if(permlink.length > 255) {
    permlink = permlink.substring(permlink.length - 255, permlink.length)
  }
  permlink = permlink.toLowerCase().replace(/[^a-z0-9-]+/g, '')
  return permlink;
}

export function processError(err) {
  let stack
  let values
  let message
  try {
    stack = err.payload.error.data.stack[0] || 'No stack available.';
    values = Object.keys(stack.data);
    message = stack.format;
    if (values.length) {
      values.map((key) => {
        const value = stack.data[key];
        message = message.split('${' + key + '}').join(value);
        return true
      });
    }
  } catch (e) {
    console.log(e);
    console.log(err);
    message = 'Unknown Error, check View -> Devtools for more information.';
  }
  return {
    err,
    stack,
    message
  }
}

export function submit(account, data, parent, action = 'post') {
  return async dispatch => {
    const ops = []
    // Set our post data
    const author = account.name
    const body = data.body
    const namespace = data.namespace
    const title = (data.title) ? data.title : ''
    const permlink = (data.existingPost) ? data.existingPost.permlink : generatePermlink(title, parent) // Prevent editing
    const parent_author = (data.existingPost) ? data.existingPost.parent_author : (parent) ? parent.author : ''
    const parent_permlink = (data.existingPost) ? data.existingPost.parent_permlink : (parent) ? parent.permlink : data.category
    // JSON to append to the post
    const json_metadata = JSON.stringify({
      app: 'chainbb/0.4',
      format: 'markdown+html',
      tags: data.tags
    })
    // Predefined beneficiaries for the platform
    let beneficiaries = [
      { "account": "chainbb", "weight": 1500 }
    ]
    // If the forum is premium, add the creator as a beneficiary
    if (data.forum && data.forum.target) {
        const { target } = data.forum
        if(target.funded >= 250 && target.creator) {
            beneficiaries = [
                { "account": "chainbb", "weight": 1000 },
                { "account": target.creator, "weight": 500},
            ]
        }
    }
    // The percentage overall (after platform splits) that the user receives - should be dynamic in the future
    const authorPercent = 85
    // Add additional beneficiaries as requested by the user
    Object.keys(data.beneficiaries).forEach((account) => {
      const requested = parseFloat(data.beneficiaries[account])
      if(requested > 0) {
        const weight = parseInt((requested / 100) * authorPercent * 100, 10)
        beneficiaries.push({account, weight})
      }
    })
    // Build the comment operation
    ops.push(['comment', { author, body, json_metadata, parent_author, parent_permlink, permlink, title }])
    // If this is not an edit, add the comment options
    if(action !== 'edit') {
      const allow_curation_rewards = true
      const allow_votes = true
      const extensions = [[0, {
        "beneficiaries": beneficiaries
      }]]
      let max_accepted_payout = "1000000.000 SBD"
      let percent_steem_dollars = 10000
      // Modify payout parameters based on reward option choosen
      switch(data.rewards) {
        case "sp":
          percent_steem_dollars = 0
          break
        case "decline":
          max_accepted_payout = "0.000 SBD"
          break
        default:
          break
      }
      ops.push(['comment_options', { allow_curation_rewards, allow_votes, author, extensions, max_accepted_payout, percent_steem_dollars, permlink }]);
      // If this is a root post, associate it with the namespace, regardless of category used
      if(!parent) {
          ops.push(['custom_json', {
              required_auths: [],
              required_posting_auths: [author],
              id: 'chainbb',
              json: JSON.stringify(['forum_post', {
                  namespace,
                  author,
                  permlink,
              }])
          }])
      }
    }
    // Uncomment below to debug posts without submitting
    // console.log('data')
    // console.log(data)
    // console.log('ops')
    // console.table(ops)
    // setTimeout(function() {
    //   dispatch({
    //     type: types.POST_SUBMIT_RESOLVED,
    //     payload: {
    //       formId: data.formId,
    //       hasError: false,
    //       post: { author, title, body, json_metadata, permlink, parent_author, parent_permlink },
    //       ts: +new Date()
    //     }
    //   })
    // }, 6000)
    steem.broadcast.send({ operations: ops, extensions: [] }, { posting: account.key }, function(err, result) {
      if(err) {
        dispatch({
          type: types.POST_SUBMIT_ERROR,
          payload: {
            formId: data.formId,
            error: processError(err),
            hasError: true,
            ts: +new Date()
          }
        })
      } else {
        dispatch({
          type: types.POST_SUBMIT_RESOLVED,
          payload: {
            formId: data.formId,
            hasError: false,
            post: { author, title, body, json_metadata, permlink, parent_author, parent_permlink },
            ts: +new Date()
          }
        })
      }
    });
  }
}

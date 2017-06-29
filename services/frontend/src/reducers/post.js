import * as types from '../actions/actionTypes';

const initialState = {
  forum: false,
  content: false,
  authors: {},
  responses: [],
  processing: {
    errors: {},
    votes: []
  }
}

function log10(str) {
    const leadingDigits = parseInt(str.substring(0, 4), 10);
    const log = Math.log(leadingDigits) / Math.LN10 + 0.00000001
    const n = str.length - 1;
    return n + (log - parseInt(log, 10));
}

export const repLog10 = rep2 => {
    if(rep2 == null) return rep2
    let rep = String(rep2)
    const neg = rep.charAt(0) === '-'
    rep = neg ? rep.substring(1) : rep

    let out = log10(rep)
    if(isNaN(out)) out = 0
    out = Math.max(out - 9, 0); // @ -9, $0.50 earned is approx magnitude 1
    out *= (neg ? -1 : 1)
    out = (out * 9) + 25 // 9 points per magnitude. center at 25
    // base-line 0 to darken and < 0 to auto hide (grep rephide)
    out = parseInt(out, 10)
    return out
}

export default function post(state = initialState, action) {
  let authors = state.authors;
  switch(action.type) {
    case types.POST_LOAD_RESOLVED:
      return Object.assign({}, state, action.payload)
    case types.POST_LOAD_BY_AUTHOR_RESOLVED:
      let { posts, totalPosts } = action.payload;
      authors[action.payload.account] = { posts, totalPosts };
      return Object.assign({}, state, { authors });
    case types.POST_LOAD_REPLIES_BY_AUTHOR_STARTED:
      if(authors[action.payload.account]) delete authors[action.payload.account]['replies']
      return Object.assign({}, state, { authors });
    case types.POST_LOAD_REPLIES_BY_AUTHOR_RESOLVED:
      let { replies, totalReplies } = action.payload;
      authors[action.payload.account] = { replies, totalReplies };
      return Object.assign({}, state, { authors });
    case types.POST_LOAD_RESPONSES_BY_AUTHOR_RESOLVED:
      let { responses, totalResponses } = action.payload;
      authors[action.payload.account] = { responses, totalResponses };
      return Object.assign({}, state, { authors });
    case types.POST_LOAD_RESPONSES_RESOLVED:
      action.payload.forEach((data, index) => {
        action.payload[index].reputation = repLog10(data['author_reputation'])
      })
      return Object.assign({}, state, {
        responses: action.payload
      })
    case types.POST_RESET_STATE:
      return initialState
    case types.POST_SUBMIT_ERROR:
      return Object.assign({}, state, {
        submitted: action.payload
      })
    case types.POST_SUBMIT_RESOLVED:
      return Object.assign({}, state, {
        submitted: action.payload
      })
    case types.POST_VOTE_PROCESSING:
      return Object.assign({}, state, {
        processing: {
          errors: {},
          votes: [action.payload]
        }
      })
    case types.POST_VOTE_RESOLVED:
      let content = state.content,
          voter = action.payload.account.name,
          weight = action.payload.weight
      if(content.author === action.payload.author) {
        content.votes[voter] = weight
      }
      setResponseVote(state, action.payload)
      return Object.assign({}, state, {
        content: content,
        processing: {
          errors: {},
          votes: completeProcessing(state, action.payload)
        }
      })
    case types.POST_VOTE_RESOLVED_ERROR:
      return Object.assign({}, state, {
        processing: {
          errors: setError(state, action.response),
          votes: completeProcessing(state, action.response.payload)
        }
      })
    case types.POST_VOTE_RESOLVED_ERROR_CLEAR:
      return Object.assign({}, state, {
        processing: {
          errors: false,
          votes: state.processing.votes
        }
      })
    default:
      return state
  }
}

function setError(state, response) {
  let errors = state.processing.errors,
      id = response.payload.author + '/' + response.payload.permlink
  errors[id] = response.error.payload.error.data.stack[0].format.split(": ")[1]
  return errors
}

function setResponseVote(state, payload) {
  let id = payload.author + '/' + payload.permlink,
      weight = payload.weight,
      voter = payload.account.name,
      { authors, responses } = state
  // Update any replies
  Object.keys(authors).forEach(function(author) {
    if(authors[author].replies) {
      authors[author].replies.forEach(function(set, key) {
        const { reply } = set
        if(reply._id === id) {
          authors[author].replies[key].reply.votes[voter] = weight
        }
      })
    }
  })
  // Update any responses
  responses.forEach(function(item, key) {
    if(item._id === id) {
      responses[key].votes[voter] = weight
    }
  })
  return responses
}

function completeProcessing(state, payload) {
  let processing = state.processing.votes,
      index = processing.indexOf(payload.author + '/' + payload.permlink)
  processing.splice(index, 1)
  return processing
}

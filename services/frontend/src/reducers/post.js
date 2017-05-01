import * as types from '../actions/actionTypes';

const initialState = {
  forum: false,
  content: false,
  responses: [],
  processing: {
    errors: {},
    votes: []
  }
}

export default function post(state = initialState, action) {
  switch(action.type) {
    case types.POST_LOAD_RESOLVED:
      return Object.assign({}, state, action.payload)
    case types.POST_LOAD_RESPONSES_RESOLVED:
      return Object.assign({}, state, {responses: action.payload})
    case types.POST_RESET_STATE:
      return initialState
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
      responses = state.responses
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

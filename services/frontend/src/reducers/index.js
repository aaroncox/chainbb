import { combineReducers } from 'redux'

import account from './account'
import breadcrumb from './breadcrumb'
import post from './post'
import preferences from './preferences'
import status from './status'

const forumReducer = combineReducers({
  account,
  breadcrumb,
  post,
  preferences,
  status
})

export default forumReducer

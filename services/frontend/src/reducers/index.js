import { combineReducers } from 'redux'

import account from './account'
import breadcrumb from './breadcrumb'
import post from './post'
import preferences from './preferences'

const forumReducer = combineReducers({
  account,
  breadcrumb,
  post,
  preferences
})

export default forumReducer

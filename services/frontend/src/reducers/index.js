import { combineReducers } from 'redux'

import account from './account'
import breadcrumb from './breadcrumb'
import post from './post'
import preferences from './preferences'
import status from './status'
import search from './search'

const forumReducer = combineReducers({
  account,
  breadcrumb,
  post,
  preferences,
  status,
  search
})

export default forumReducer

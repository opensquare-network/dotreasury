import { combineReducers } from '@reduxjs/toolkit'
import testReducer from './testSlice'
import tipsReducer from './tipSlice'
import proposalsReducer from './proposalSlice'
import bountiesReducer from './bountySlice'
import chainReducer from './chainSlice'
import linksReducer from './linkSlice'
import accountReducer from './accountSlice'

export default combineReducers({
  test: testReducer,
  tips: tipsReducer,
  links: linksReducer,
  proposals: proposalsReducer,
  bounties: bountiesReducer,
  chain: chainReducer,
  account: accountReducer,
})

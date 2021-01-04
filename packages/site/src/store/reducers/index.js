import { combineReducers } from '@reduxjs/toolkit'
import testReducer from './testSlice'
import tipsReducer from './tipSlice'
import proposalsReducer from './proposalSlice'
import chainReducer from './chainSlice'

export default combineReducers({
  test: testReducer,
  tips: tipsReducer,
  proposals: proposalsReducer,
  chain: chainReducer,
})

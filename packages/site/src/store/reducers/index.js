import { combineReducers } from '@reduxjs/toolkit'
import testReducer from './testSlice'
import tipsReducer from './tipSlice'
import chainReducer from './chainSlice'

export default combineReducers({
  test: testReducer,
  tips: tipsReducer,
  chain: chainReducer,
})

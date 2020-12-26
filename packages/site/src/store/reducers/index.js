import { combineReducers } from '@reduxjs/toolkit'
import testReducer from './testSlice'
import tipsReducer from './tipSlice'

export default combineReducers({
  test: testReducer,
  tips: tipsReducer,
})

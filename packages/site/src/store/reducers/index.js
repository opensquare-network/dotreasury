import { combineReducers } from '@reduxjs/toolkit'
import testReducer from './testSlice'

export default combineReducers({
  test: testReducer
})

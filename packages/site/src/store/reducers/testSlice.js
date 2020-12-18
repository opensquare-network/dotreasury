import { createSlice } from '@reduxjs/toolkit'

const testSlice = createSlice({
  name: 'test',
  initialState: 'test',
  reducers: {
    setTest: {
      reducer(state, action) {
        const { text } = action.payload
        return text
      },
      prepare(text) {
        return { payload: { text } }
      }
    }
  }
})

export const { setTest } = testSlice.actions
export const testSelector = state => state
export default testSlice.reducer

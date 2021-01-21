import { createSlice } from "@reduxjs/toolkit";
import api from "../../services/scanApi";

const commentSlice = createSlice({
  name: "comments",
  initialState: {
    comments: [],
  },
  reducers: {
    setComments(state, { payload }) {
      state.comments = payload;
    },
  },
});

export const {
  setComments,
} = commentSlice.actions;

export class TipIndex {
  constructor(tipIndex) {
    const match = tipIndex.match(/^(\d+)_(0x[0-9a-f]+)$/);
    if (!match) {
      throw new Error("Invaild tip index");
    }

    this.blockHeight = parseInt(match[1]);
    this.tipHash = match[2];
  }

  toString() {
    return `${this.blockHeight}_${this.tipHash}`;
  }
}

export const fetchComments = (type, index) => async (dispatch) => {
  const { result } = await api.fetch(`/${type}/${index}/comments`);
  dispatch(setComments(result || []));
};

const getAccessToken = () => localStorage.getItem('token');

export const postComment = (type, index, content) => async (dispatch) => {
  await api.fetch(`/${type}/${index}/comments`, {}, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getAccessToken()}`
    },
    body: JSON.stringify({ content }),
  });

  dispatch(fetchComments(type, index));
}

export const updateComment = (type, index, content) => async (dispatch) => {
  await api.fetch(`/${type}/${index}/comments`, {}, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getAccessToken()}`
    },
    body: JSON.stringify({ content }),
  });

  dispatch(fetchComments(type, index));
}

export const removeComment = (type, index, commentId) => async (dispatch) => {
  await api.fetch(`/${type}/${index}/comments/${commentId}`, {}, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${getAccessToken()}`
    },
  });
  dispatch(fetchComments(type, index));
}

export const commentsSelector = (state) => state.comments.comments;

export default commentSlice.reducer;

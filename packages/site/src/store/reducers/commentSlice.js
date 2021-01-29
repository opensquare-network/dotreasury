import { createSlice } from "@reduxjs/toolkit";
import { REACTION_THUMBDOWN, REACTION_THUMBUP } from "../../constants";
import api from "../../services/scanApi";

const commentSlice = createSlice({
  name: "comments",
  initialState: {
    comments: [],
    clearComment: false
  },
  reducers: {
    setComments(state, { payload }) {
      state.comments = payload;
    },
    setClearComment(state, { payload }) {
      state.clearComment = payload;
    }
  },
});

export const { setComments, setClearComment } = commentSlice.actions;

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

export const postComment = (type, index, content) => async (dispatch) => {
  const { result } =  await api.authFetch(
    `/${type}/${index}/comments`,
    {},
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content }),
    }
  );

  result && dispatch(setClearComment(true));
  dispatch(fetchComments(type, index));
};

export const updateComment = (type, index, commentId, content) => async (
  dispatch
) => {
  await api.authFetch(
    `/comments/${commentId}`,
    {},
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content }),
    }
  );

  dispatch(fetchComments(type, index));
};

export const removeComment = (type, index, commentId) => async (dispatch) => {
  await api.authFetch(
    `/comments/${commentId}`,
    {},
    {
      method: "DELETE",
    }
  );

  dispatch(fetchComments(type, index));
};

export const setCommentThumbUp = (type, index, commentId) => async (
  dispatch
) => {
  await api.authFetch(
    `/comments/${commentId}/reaction`,
    {},
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ reaction: REACTION_THUMBUP }),
    }
  );

  dispatch(fetchComments(type, index));
};

export const setCommentThumbDown = (type, index, commentId) => async (
  dispatch
) => {
  await api.authFetch(
    `/comments/${commentId}/reaction`,
    {},
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ reaction: REACTION_THUMBDOWN }),
    }
  );

  dispatch(fetchComments(type, index));
};

export const unsetCommentReaction = (type, index, commentId) => async (
  dispatch
) => {
  await api.authFetch(
    `/comments/${commentId}/reaction`,
    {},
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  dispatch(fetchComments(type, index));
};

export const commentsSelector = (state) => state.comments.comments;
export const clearCommentSelector = (state) => state.comments.clearComment;

export default commentSlice.reducer;

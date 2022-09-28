import { createSlice } from "@reduxjs/toolkit";
import pluralize from "pluralize";
import { REACTION_THUMBDOWN, REACTION_THUMBUP } from "../../constants";
import api from "../../services/scanApi";

const commentSlice = createSlice({
  name: "comments",
  initialState: {
    comments: {
      items: [],
      page: 0,
      pageSize: 10,
      total: 0,
    },
    clearComment: false,
    lastNewPost: null,
    lastUpdateCommentTime: 0,
  },
  reducers: {
    setComments(state, { payload }) {
      state.comments = payload;
    },
    setClearComment(state, { payload }) {
      state.clearComment = payload;
    },
    setLastNewPost(state, { payload }) {
      state.lastNewPost = payload;
    },
    setLastUpdateCommentTime(state, { payload }) {
      state.lastUpdateCommentTime = payload;
    },
  },
});

export const {
  setLoading,
  setComments,
  setClearComment,
  setLastNewPost,
  setLastUpdateCommentTime,
  setCurrentPage,
} = commentSlice.actions;

export const fetchComments = (chain, type, index, page, pageSize) => async (
  dispatch
) => {
  const { result } = await api.maybeAuthFetch(
    `/${chain}/${pluralize(type)}/${index}/comments`,
    {
      page,
      pageSize,
    }
  );
  dispatch(
    setComments(
      result || {
        items: [],
        page: 0,
        pageSize: 10,
        total: 0,
      }
    )
  );
};

export const postComment = (chain, type, index, content) => async (
  dispatch
) => {
  const { result } = await api.authFetch(
    `/${chain}/${pluralize(type)}/${index}/comments`,
    {},
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content }),
    }
  );

  if (result) {
    dispatch(setClearComment(true));
    dispatch(setLastNewPost(result));
  }
};

export const updateComment = (chain, type, index, commentId, content) => async (
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

  dispatch(fetchComments(chain, type, index));
};

export const removeComment = (commentId) => async (dispatch) => {
  await api.authFetch(
    `/comments/${commentId}`,
    {},
    {
      method: "DELETE",
    }
  );
};

export const setCommentThumbUp = (commentId) => async (dispatch) => {
  return await api.authFetch(
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
};

export const setCommentThumbDown = (commentId) => async (dispatch) => {
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

  dispatch(setLastUpdateCommentTime(Date.now()));
};

export const unsetCommentReaction = (commentId) => async (dispatch) => {
  return await api.authFetch(
    `/comments/${commentId}/reaction`,
    {},
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};

export const commentsSelector = (state) => state.comments.comments;
export const clearCommentSelector = (state) => state.comments.clearComment;
export const lastNewPostSelector = (state) => state.comments.lastNewPost;
export const lastUpdateCommentTimeSelector = (state) =>
  state.comments.lastUpdateCommentTime;

export default commentSlice.reducer;

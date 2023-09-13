import { createSlice } from "@reduxjs/toolkit";
import pluralize from "pluralize";
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

export const fetchComments =
  (type, index, page, pageSize) => async (dispatch) => {
    const { result } = await api.maybeAuthFetch(
      `/${pluralize(type)}/${index}/comments`,
      {
        page,
        pageSize,
      },
    );
    dispatch(
      setComments(
        result || {
          items: [],
          page: 0,
          pageSize: 10,
          total: 0,
        },
      ),
    );
  };

export const commentsSelector = (state) => state.comments.comments;
export const clearCommentSelector = (state) => state.comments.clearComment;
export const lastNewPostSelector = (state) => state.comments.lastNewPost;
export const lastUpdateCommentTimeSelector = (state) =>
  state.comments.lastUpdateCommentTime;

export default commentSlice.reducer;

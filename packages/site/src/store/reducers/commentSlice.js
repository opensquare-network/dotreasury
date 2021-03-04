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
    loading: false,
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
    setLoading(state, { payload }) {
      state.loading = payload;
    },
  },
});

export const {
  setLoading,
  setComments,
  setClearComment,
  setLastNewPost,
  setLastUpdateCommentTime,
} = commentSlice.actions;

export class TipIndex {
  constructor(tipIndex) {
    const match = tipIndex.match(/^(\d+)_(0x[0-9a-f]+)$/);
    if (!match) {
      throw new Error("Invalid tip index");
    }

    this.blockHeight = parseInt(match[1]);
    this.tipHash = match[2];
  }

  toString() {
    return `${this.blockHeight}_${this.tipHash}`;
  }
}

export const fetchComments = (type, index, page, pageSize) => async (
  dispatch
) => {
  dispatch(setLoading(true));
  try{
    const { result } = await api.maybeAuthFetch(
      `/${pluralize(type)}/${index}/comments`,
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
  } finally {
    dispatch(setLoading(false));
  }
};

export const postComment = (type, index, content) => async (dispatch) => {
  const { result } = await api.authFetch(
    `/${pluralize(type)}/${index}/comments`,
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

  dispatch(setLastUpdateCommentTime(Date.now()));
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

  dispatch(setLastUpdateCommentTime(Date.now()));
};

export const commentsSelector = (state) => state.comments.comments;
export const clearCommentSelector = (state) => state.comments.clearComment;
export const lastNewPostSelector = (state) => state.comments.lastNewPost;
export const lastUpdateCommentTimeSelector = (state) => state.comments.lastUpdateCommentTime;
export const loadingSelector = (state) => state.comments.loading;

export default commentSlice.reducer;

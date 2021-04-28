import { createSlice } from "@reduxjs/toolkit";
import api from "../../services/scanApi";

const projectSlice = createSlice({
  name: "projects",
  initialState: {
    projects: {
      items: [],
    },
    loading: false,
    projectDetail: {},
    loadingProjectDetail: false,
  },
  reducers: {
    setProjects(state, { payload }) {
      state.projects = payload;
    },
    setLoading(state, { payload }) {
      state.loading = payload;
    },
    setProjectDetail(state, { payload }) {
      state.projectDetail = payload;
    },
    setLoadingProjectDetail(state, { payload }) {
      state.loadingProjectDetail = payload;
    },
  },
});

export const {
  setProjects,
  setLoading,
  setProjectDetail,
  setLoadingProjectDetail,
} = projectSlice.actions;

export const fetchProjects = (chain, page = 0, pageSize = 30) => async (
  dispatch
) => {
  dispatch(setLoading(true));

  try {
    const { result } = await api.fetch(`/${chain}/projects`, {
      page,
      pageSize,
    });
    dispatch(setProjects(result || {}));
  } finally {
    dispatch(setLoading(false));
  }
};

export const fetchProjectDetail = (chain, projectId) => async (dispatch) => {
  dispatch(setLoadingProjectDetail(true));
  try {
    const { result } = await api.fetch(`/${chain}/projects/${projectId}`);
    dispatch(setProjectDetail(result || {}));
  } finally {
    dispatch(setLoadingProjectDetail(false));
  }
};

export const projectsSelector = (state) => state.projects.projects;
export const loadingSelector = (state) => state.projects.loading;
export const projectDetailSelector = (state) => state.projects.projectDetail;
export const loadingProjectDetailSelector = (state) =>
  state.projects.loadingProjectDetail;

export default projectSlice.reducer;

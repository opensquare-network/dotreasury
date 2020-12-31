import { createSlice } from "@reduxjs/toolkit";
import api from "../../services/scanApi";
import { signMessage } from "../../services/chainApi";

const linkSlice = createSlice({
  name: "links",
  initialState: {
    links: [],
  },
  reducers: {
    setLinks(state, { payload }) {
      state.links = payload;
    },
  },
});

export const {
  setLinks,
} = linkSlice.actions;

export const fetchLinks = (type, index) => async (dispatch) => {
  const { result } = await api.fetch(`/${type}/${index}/links`);
  dispatch(setLinks(result || []));
};

export const addLink = (type, index, link, description) => async (dispatch) => {
  const signature = await signMessage(JSON.stringify({type, index, link, description}), "5DDFyTwHkagfiTsa2kH2N3r8hJBc976aWb5DPnRWeK61LopK");

  await api.fetch(`/${type}/${index}/links`, {}, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Signature': signature,
    },
    body: JSON.stringify({ link, description }),
  });

  dispatch(fetchLinks(type, index));
}

export const removeLink = (type, index, linkIndex) => async (dispatch) => {
  await api.fetch(`/${type}/${index}/links/${linkIndex}`, {}, {
    method: 'DELETE',
  });
  dispatch(fetchLinks(type, index));
}

export const linksSelector = (state) => state.links.links;

export default linkSlice.reducer;

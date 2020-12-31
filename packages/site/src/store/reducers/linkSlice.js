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

export const addLink = (type, index, link, description, address) => async (dispatch) => {
  const signature = await signMessage(
    JSON.stringify({
      type,
      index,
      link,
      description,
    }), address);

  await api.fetch(`/${type}/${index}/links`, {}, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Signature': `${address}/${signature}`,
    },
    body: JSON.stringify({ link, description }),
  });

  dispatch(fetchLinks(type, index));
}

export const removeLink = (type, index, linkIndex, address) => async (dispatch) => {
  const signature = await signMessage(
    JSON.stringify({
      type,
      index,
      linkIndex: linkIndex.toString(),
    }), address);

  await api.fetch(`/${type}/${index}/links/${linkIndex}`, {}, {
    method: 'DELETE',
    headers: {
      'Signature': `${address}/${signature}`,
    },
  });
  dispatch(fetchLinks(type, index));
}

export const linksSelector = (state) => state.links.links;

export default linkSlice.reducer;

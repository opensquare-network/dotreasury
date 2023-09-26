import { createSlice } from "@reduxjs/toolkit";
import pluralize from "pluralize";
import api from "../../services/scanApi";
import { signMessageWithExtension } from "../../services/chainApi";

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

export const { setLinks } = linkSlice.actions;

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

export const fetchLinks = (type, index) => async (dispatch) => {
  const { result } = await api.fetch(`/${pluralize(type)}/${index}/links`);
  dispatch(setLinks(result || []));
};

export const addLink =
  (type, index, link, description, address, extensionName) =>
  async (dispatch, getState) => {
    const { chain } = getState();
    const signature = await signMessageWithExtension(
      JSON.stringify({
        chain: chain.chain,
        type,
        index,
        link,
        description,
      }),
      address,
      extensionName,
    );

    await api.fetch(
      `/${pluralize(type)}/${index}/links`,
      {},
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Signature: address ? `${address}/${signature}` : "",
        },
        body: JSON.stringify({ link, description }),
      },
    );
    dispatch(fetchLinks(type, index));
  };

export const removeLink =
  (type, index, linkIndex, address, extensionName) =>
  async (dispatch, getState) => {
    const { chain } = getState();
    const signature = await signMessageWithExtension(
      JSON.stringify({
        chain: chain.chain,
        type,
        index,
        linkIndex,
      }),
      address,
      extensionName,
    );

    await api.fetch(
      `/${pluralize(type)}/${index}/links/${linkIndex}`,
      {},
      {
        method: "DELETE",
        headers: {
          Signature: address ? `${address}/${signature}` : "",
        },
      },
    );
    dispatch(fetchLinks(type, index));
  };

export const linksSelector = (state) => state.links.links;

export default linkSlice.reducer;

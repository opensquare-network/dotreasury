import { combineReducers } from "@reduxjs/toolkit";
import testReducer from "./testSlice";
import tipsReducer from "./tipSlice";
import proposalsReducer from "./proposalSlice";
import bountiesReducer from "./bountySlice";
import burntReducer from "./burntSlice";
import chainReducer from "./chainSlice";
import linksReducer from "./linkSlice";
import accountReducer from "./accountSlice";
import overviewReducer from "./overviewSlice";
import userReducer from "./userSlice";
import commentReducer from "./commentSlice";
import nodeReducer from "./nodeSlice";
import toastReducer from "./toastSlice";

export default combineReducers({
  test: testReducer,
  tips: tipsReducer,
  links: linksReducer,
  proposals: proposalsReducer,
  bounties: bountiesReducer,
  burnt: burntReducer,
  chain: chainReducer,
  account: accountReducer,
  overview: overviewReducer,
  users: userReducer,
  comments: commentReducer,
  node: nodeReducer,
  toast: toastReducer
});

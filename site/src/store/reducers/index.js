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
import incomeReducer from "./incomeSlice";
import menuReducer from "./menuSlice";
import nodeReducer from "./nodeSlice";
import projectsReducer from "./projectSlice";
import toastReducer from "./toastSlice";
import transferReducer from "./transferSlice";
import rateReducer from "./rateSlice";
import descriptionReducer from "./descriptionSlice";
import tipFindersReducer from "./tipFindersSlice";
import proposalBeneficiariesReducer from "./proposalBeneficiariesSlice";
import usersReducer from "./usersSlice";
import usersDetailReducer from "./usersDetailSlice";
import openGovApplicationsReducer from "./openGovApplicationsSlice";
import centrifugeGasFeeReducer from "./centrifugeGasFeeSlice";
import centrifugeBlockRewardReducer from "./centrifugeBlockRewardSlice";

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
  user: userReducer,
  comments: commentReducer,
  toast: toastReducer,
  income: incomeReducer,
  menu: menuReducer,
  node: nodeReducer,
  projects: projectsReducer,
  transfers: transferReducer,
  rate: rateReducer,
  description: descriptionReducer,
  tipFinders: tipFindersReducer,
  proposalBeneficiaries: proposalBeneficiariesReducer,
  users: usersReducer,
  usersDetail: usersDetailReducer,
  openGovApplications: openGovApplicationsReducer,
  centrifugeGasFee: centrifugeGasFeeReducer,
  centrifugeBlockReward: centrifugeBlockRewardReducer,
});

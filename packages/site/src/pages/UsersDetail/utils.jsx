import { USER_ROLES } from "../../constants";

export function isProposalsRole(role) {
  return [USER_ROLES.Beneficiary, USER_ROLES.Proposer].includes(role);
}

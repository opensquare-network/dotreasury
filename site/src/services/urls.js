// NOTE: collection for all api urls
// TODO: move all to here
import { makeUrlPathname } from "../utils/url";

// page user detail
// route: /:symbol/users/:address
export function userDetailProposalCounts(address, role) {
  return makeUrlPathname("account", address, role, "counts");
}
export function userDetailCouncilorTerms(address) {
  return makeUrlPathname("account", address, "councilor", "terms");
}
export function userDetailCouncilorMotions(address) {
  return makeUrlPathname("account", address, "councilor", "motions");
}
export function userDetailCouncilorTips(address) {
  return makeUrlPathname("account", address, "councilor", "tippers");
}
export function userDetailCouncilorRates(address) {
  return makeUrlPathname("account", address, "councilor", "rates");
}

export function userDetailRates(address) {
  return makeUrlPathname("account", address, "rates");
}

export function userDetailCouncilorRateStats(address) {
  return makeUrlPathname("account", address, "councilor", "ratestats");
}

export function userDetailRateStats(address) {
  return makeUrlPathname("account", address, "ratestats");
}

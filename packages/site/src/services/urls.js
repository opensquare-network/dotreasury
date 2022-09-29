// NOTE: collection for all api urls
// TODO: move all to here
import { makeUrlPathname } from "../utils/url";

// page user detail
// route: /:symbol/users/:address
export function userDetailProposalCounts(chain, address, role) {
  return makeUrlPathname(chain, "account", address, role, "counts");
}
export function userDetailCouncilorTerms(chain, address) {
  return makeUrlPathname(chain, "account", address, "councilor", "terms");
}
export function userDetailCouncilorMotions(chain, address) {
  return makeUrlPathname(chain, "account", address, "councilor", "motions");
}
export function userDetailCouncilorTips(chain, address) {
  return makeUrlPathname(chain, "account", address, "councilor", "tippers");
}
export function userDetailCouncilorRates(chain, address) {
  return makeUrlPathname(chain, "account", address, "councilor", "rates");
}
export function userDetailCouncilorRateStats(chain, address) {
  return makeUrlPathname(chain, "account", address, "councilor", "ratestats");
}

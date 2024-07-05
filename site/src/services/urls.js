// NOTE: collection for all api urls
// TODO: move all to here

// page user detail
// route: /:symbol/users/:address
export function userDetailProposalCountsApi(address, role) {
  return `/account/${address}/${role}/counts`;
}
export function userDetailCouncilorTermsApi(address) {
  return `/account/${address}/councilor/terms`;
}
export function userDetailCouncilorMotionsApi(address) {
  return `/account/${address}/councilor/motions`;
}
export function userDetailCouncilorTipsApi(address) {
  return `/account/${address}/councilor/tips`;
}
export function userDetailCouncilorRatesApi(address) {
  return `/account/${address}/councilor/rates`;
}

export function userDetailRatesApi(address) {
  return `/account/${address}/rates`;
}

export function userDetailCouncilorRateStatsApi(address) {
  return `/account/${address}/councilor/ratestats`;
}

export function userDetailRateStatsApi(address) {
  return `/account/${address}/ratestats`;
}

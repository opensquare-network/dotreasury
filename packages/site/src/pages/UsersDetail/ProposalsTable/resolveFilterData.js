/**
 * @param {Object} filterData
 * @param {Object} extraData
 * @description resolve filter data with extra data
 */
export function resolveFilterData(filterData, extraData = {}) {
  return {
    ...filterData,
    [extraData.role?.toLowerCase()]: extraData.address,
  };
}

/**
 * @param {Object} filterData
 * @param {Object} extraData
 */
export function resolveFilterData(filterData, extraData = {}) {
  return {
    ...filterData,
    [extraData.role?.toLowerCase()]: extraData.address,
  };
}

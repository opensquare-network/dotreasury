/**
 * @param {number} index table row index
 * @param {number} page current page number, starts from 1
 * @param {number} pageSize
 * @description resolve table serial number locally
 */
export function resolveTableSerialNumber(index, page, pageSize) {
  return (page - 1) * pageSize + index;
}

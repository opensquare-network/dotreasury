/**
 * @param {string} str
 * @param {number} start
 * @param {number} end
 * @returns {string}
 * @description ellpsis a string
 */
export function ellipsis(str = "", start = 4, end = start) {
  if (typeof str !== "string") return str;

  let res = str.slice(0, start) + "...";

  if (end) {
    res += str.slice(str.length - end, str.length);
  }

  return res;
}

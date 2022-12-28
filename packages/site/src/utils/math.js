/**
 * @description lodash.sum
 */
export function sum(arr = []) {
  return arr.reduce((val, n) => {
    val += n;
    return val;
  }, 0);
}

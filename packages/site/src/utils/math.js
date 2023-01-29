/**
 * @description lodash.sum
 */
export function sum(arr = []) {
  return arr.reduce((val, n) => {
    val += n;
    return val;
  }, 0);
}

/**
 * @description lodash.sumBy
 */
export function sumBy(arr = [], iteratee) {
  return arr.reduce((val, item) => {
    val += item[iteratee];
    return val;
  }, 0);
}

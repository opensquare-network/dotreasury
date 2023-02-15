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
    const n = typeof iteratee === "function" ? iteratee(item) : item[iteratee];
    val += n;

    return val;
  }, 0);
}

/**
 * @description lodash.maxBy
 */
export function maxBy(arr = [], iteratee) {
  const numbers = arr.map((item) => {
    const n = typeof iteratee === "function" ? iteratee(item) : item[iteratee];
    return n ?? 0;
  });

  return Math.max(...numbers);
}

export function parseEstimateTime(time) {
  const { days, hours, minutes, seconds } = time ?? {};

  const format = (/** @type {number} */ n, /** @type {string} */ s) =>
    `${n} ${s}${n > 1 ? "s" : ""}`;

  const timeStr = [
    days && format(days, "day"),
    hours && format(hours, "hr"),
    minutes && format(minutes, "min"),
    seconds && `${seconds}s`,
  ]
    .filter(Boolean)
    .slice(0, 2)
    .join(" ");

  return timeStr;
}

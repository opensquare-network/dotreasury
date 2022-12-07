// https://gitlab.com/mmillerbkg/chartjs-adapter-dayjs

import { _adapters } from "chart.js";

import dayjs from "dayjs";

// Needed to handle the custom parsing
import CustomParseFormat from "dayjs/plugin/customParseFormat";

// Needed to handle quarter format
import AdvancedFormat from "dayjs/plugin/advancedFormat";

// Needed to handle adding/subtracting quarter
import QuarterOfYear from "dayjs/plugin/quarterOfYear";

// Needed to handle localization format
import LocalizedFormat from "dayjs/plugin/localizedFormat";

import isoWeek from "dayjs/plugin/isoWeek";

dayjs.extend(AdvancedFormat);

dayjs.extend(QuarterOfYear);

dayjs.extend(LocalizedFormat);

dayjs.extend(CustomParseFormat);

dayjs.extend(isoWeek);

const FORMATS = {
  datetime: "MMM D, YYYY, h:mm:ss a",
  millisecond: "h:mm:ss.SSS a",
  second: "h:mm:ss a",
  minute: "h:mm a",
  hour: "hA",
  day: "MMM D",
  week: "ll",
  month: "MMM YYYY",
  quarter: "[Q]Q - YYYY",
  year: "YYYY",
};

_adapters._date.override({
  //_id: 'dayjs', //DEBUG,
  formats: () => FORMATS,
  parse: function (value, format) {
    const valueType = typeof value;

    if (value === null || valueType === "undefined") {
      return null;
    }

    if (valueType === "string" && typeof format === "string") {
      return dayjs(value, format).isValid()
        ? dayjs(value, format).valueOf()
        : null;
    } else if (!(value instanceof dayjs)) {
      return dayjs(value).isValid() ? dayjs(value).valueOf() : null;
    }
    return null;
  },
  format: function (time, format) {
    return dayjs(time).format(format);
  },
  add: function (time, amount, unit) {
    return dayjs(time).add(amount, unit).valueOf();
  },
  diff: function (max, min, unit) {
    return dayjs(max).diff(dayjs(min), unit);
  },
  startOf: function (time, unit, weekday) {
    if (unit === "isoWeek") {
      // Ensure that weekday has a valid format
      //const formattedWeekday

      const validatedWeekday =
        typeof weekday === "number" && weekday > 0 && weekday < 7 ? weekday : 1;

      return dayjs(time).isoWeekday(validatedWeekday).startOf("day").valueOf();
    }

    return dayjs(time).startOf(unit).valueOf();
  },
  endOf: function (time, unit) {
    return dayjs(time).endOf(unit).valueOf();
  },
});

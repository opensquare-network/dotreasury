import React from 'react'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

function durationToStr(d, maxSection = 2) {
  let str = "";
  const append = (orig, tail) => orig + (orig ? " " : "") + tail;

  const sections = [
    d.years() && `${d.years()}y`,
    d.months() && `${d.months()}mon`,
    d.days() && `${d.days()}d`,
    d.hours() && `${d.hours()}h`,
    d.minutes() && `${d.minutes()}min`,
  ];

  for (let i = 0, j = 0; i < sections.length && j < maxSection; i++) {
    const sec = sections[i];
    if (!sec && !j) {
      continue;
    }

    if (sec) {
      str = append(str, sec);
    }

    j++;
  }

  if (str === "") {
    str = `${d.seconds()}s`;
  }

  return str;
}

export default function TimeElapsed({ from }) {
  let elapsedStr = "";

  if (from) {
    const nFrom = parseInt(from);
    const d = dayjs.duration(dayjs().diff(nFrom))
    elapsedStr = durationToStr(d);
  }

  return <span>{elapsedStr}</span>;
}

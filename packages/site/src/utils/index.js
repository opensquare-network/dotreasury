import BigNumber from "bignumber.js";
import { stringUpperFirst, stringCamelCase } from "@polkadot/util";
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

export function toPrecision(value, precision = 0, paddingZero = true) {
  precision = Number(precision);
  const big = new BigNumber(value).dividedBy(Math.pow(10, precision));

  if (paddingZero) {
    return big.toFixed(precision);
  } else {
    return big.toNumber();
  }
}

export function stringCamlToWords(str) {
  return stringUpperFirst(str).replace(/(.)([A-Z])/g, "$1 $2");
}

export function stringToWords(str) {
  return stringCamlToWords(stringCamelCase(str));
}

export const nil = (val) => val === undefined || val === null;

export const getLinkNameAndSrc = (link) => {
  try {
    const url = new URL(link);

    let src = "";
    let name = "";
    if (url.host.endsWith("youtube.com") || url.host.endsWith("youtu.be")) {
      src = "/imgs/youtube-logo.svg";
      name = "YouTube";
    } else if (url.host.endsWith("github.com") || url.host.endsWith("github.io")) {
      src = "/imgs/github-logo.svg";
      name = "GitHub";
    } else if (url.host.endsWith("medium.com")) {
      src = "/imgs/medium-logo.svg";
      name = "Medium";
    } else if (url.host.endsWith("polkassembly.io")) {
      src = "/imgs/polkassembly-logo.svg";
      name = "Polkassembly";
    } else if (url.host.endsWith("twitter.com")) {
      src = "/imgs/twitter-logo.svg";
      name = "Twitter";
    } else if (url.host === "t.me") {
      src = "/imgs/telegram-logo.svg";
      name = "Telegram";
    } else if (url.host.endsWith("docs.google.com")) {
      src = "/imgs/googledoc-logo.svg";
      name = "Google Docs";
    } else if (url.host.endsWith("drive.google.com")) {
      src = "/imgs/googledrive-logo.svg";
      name = "Google Drive";
    } else if (url.host.endsWith("opensquare.network")) {
      src = "/imgs/opensquare-icon-logo.svg";
      name = "OpenSquare";
    } else if (url.host.endsWith("dotreasury.com")) {
      src = "/imgs/dotreasury-logo.svg";
      name = "doTreasury";
    } else {
      src = "/imgs/link-icon.svg";
    }

    if (!name) {
      [, name] = url.host.match(/([^.]*)(\.[a-z]+)?$/);
      if (['co', 'com'].includes(name)) {
        const m = url.host.match(/([^.]*)(?:\.[a-z]+){2}$/);
        if (m) {
          [, name] = m;
        }
      }
      name = stringUpperFirst(name);
    }

    return [name, src];
  } catch (e) {
    // Broken link or other errors
    return [];
  }
}

export function normalizeTimeDuration(time, maxSection = 2) {
  const duration = dayjs.duration(time)

  const result = [];

  const sections = [
    duration.years() && [duration.years(), 'y'],
    duration.months() && [duration.months(), 'mon'],
    duration.days() && [duration.days(), 'd'],
    duration.hours() && [duration.hours(), 'h'],
    duration.minutes() && [duration.minutes(), 'min'],
  ];
  for (let i = 0, j = 0; i < sections.length && j < maxSection; i++) {
    const sec = sections[i];
    if (!sec && !j) {
      continue;
    }

    if (sec) {
      result.push(sec);
    }

    j++;
  }

  if (result.length === 0) {
    result.push([duration.seconds(), 's']);
  }

  return result;
}

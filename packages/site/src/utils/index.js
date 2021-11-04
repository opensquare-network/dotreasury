import BigNumber from "bignumber.js";
import { stringUpperFirst, stringCamelCase } from "@polkadot/util";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import md5 from "md5";
import { CHAINS } from "../constants";

dayjs.extend(duration);

function strEqualIgnoreCase(str1 = "", str2 = "") {
  return str1.toLowerCase() === str2.toLowerCase();
}

export function getPrecision(chainSymbol) {
  if (strEqualIgnoreCase(CHAINS.KUSAMA, chainSymbol)) {
    return 12;
  }

  if (strEqualIgnoreCase(CHAINS.POLKADOT, chainSymbol)) {
    return 10;
  }

  return 12;
}

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
    } else if (
      url.host.endsWith("github.com") ||
      url.host.endsWith("github.io")
    ) {
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
      [, name] = url.host.match(/([^.]*)(?:\.[a-z]+)?$/);
      if (["co", "com"].includes(name)) {
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
};

export function normalizeTimeDuration(time, maxSection = 2) {
  const duration = dayjs.duration(time);

  const result = [];

  const sections = [
    duration.years() && [duration.years(), "y"],
    duration.months() && [duration.months(), "mon"],
    duration.days() && [duration.days(), "d"],
    duration.hours() && [duration.hours(), "h"],
    duration.minutes() && [duration.minutes(), "min"],
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
    result.push([duration.seconds(), "s"]);
  }

  return result;
}

export function unique(arr) {
  return Array.from(new Set(arr));
}

export const sleep = (time) => {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
};

export const getGravatarSrc = (email) => {
  // default img url
  // https%3A%2F%2www.dotreasury.com%2imgs%2avatar.png
  if (email && typeof email === "string") {
    return `https://www.gravatar.com/avatar/${md5(
      email.trim().toLocaleLowerCase()
    )}?d=https://www.dotreasury.com/imgs/avatar.png`;
  }
  return "/imgs/avatar.png";
};

export function networkFromSymbol(symbol) {
  if (symbol.toLowerCase() === CHAINS.KUSAMA) {
    return "kusama";
  } else if (symbol.toLowerCase() === CHAINS.POLKADOT) {
    return "polkadot";
  } else {
    return null;
  }
}

export function symbolFromNetwork(network) {
  if (network === "kusama") {
    return CHAINS.KUSAMA;
  } else if (network === "polkadot") {
    return CHAINS.POLKADOT;
  } else {
    return null;
  }
}

export function capitalizeFirstLetter(string) {
  if (!string) return "";
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function toLocaleStringWithFixed(num = 0, fixed = 2) {
  return num.toLocaleString(undefined, { minimumFractionDigits: fixed });
}

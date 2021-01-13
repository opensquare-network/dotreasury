import BigNumber from "bignumber.js";
import { stringUpperFirst } from "@polkadot/util";

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

export const nil = (val) => val === undefined || val === null;

export const getLinkNameAndSrc = (link) => {
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
  } else if (url.host.endsWith("t.me")) {
    src = "/imgs/telegram-logo.svg";
    name = "Telegram";
  } else {
    src = "/imgs/link-icon.svg";
  }

  if (!name) {
    [, name] = url.host.match(/([^.]*)\.[a-z]+$/);
    name = stringUpperFirst(name);
  }
  return [name, src];
}

import BigNumber from "bignumber.js";
import { hexToU8a, isHex, stringCamelCase, stringUpperFirst } from "@polkadot/util";
import { decodeAddress, encodeAddress } from "@polkadot/util-crypto";
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

export function abbreviateBigNumber(x, fixed = 2) {
  const n = new BigNumber(x);
  const fmt = {
    decimalSeparator: ".",
    groupSeparator: ",",
    groupSize: 3,
  };
  let divideBy = new BigNumber("1");
  const bigNumbers = [
    { bigNumber: new BigNumber("1000"), abbr: "K" },
    { bigNumber: new BigNumber("1000000"), abbr: "M" },
    { bigNumber: new BigNumber("1000000000"), abbr: "B" },
    { bigNumber: new BigNumber("1000000000000"), abbr: "T" },
    { bigNumber: new BigNumber("1000000000000000"), abbr: "Q" },
  ];
  bigNumbers.forEach((data) => {
    if (n.isGreaterThan(data.bigNumber)) {
      divideBy = data.bigNumber;
      fmt.suffix = data.abbr;
    }
  });
  BigNumber.config({ FORMAT: fmt });
  return new BigNumber(n.dividedBy(divideBy).toFixed(fixed)).toFormat();
}

export function emptyFunction() {}

export function isSameAddress(addr1, addr2) {
  if (!addr1 || !addr2) {
    return false;
  }

  try {
    return encodeAddress(addr1, 42) === encodeAddress(addr2, 42);
  } catch (e) {
    return false;
  }
}

export function isAddress(address) {
  try {
    encodeAddress(isHex(address) ? hexToU8a(address) : decodeAddress(address));

    return true;
  } catch (error) {
    return false;
  }
}

export function checkInputValue(value, valueName = "Value", allowZero = false) {
  if (!value) {
    return `${valueName} cannot be empty`;
  }

  const bnValue = new BigNumber(value);

  if (bnValue.isNaN()) {
    return `${valueName} must be number`;
  }

  if (allowZero) {
    if (!bnValue.gte(0)) {
      return `${valueName} must not be less then 0`;
    }
  } else {
    if (!bnValue.gt(0)) {
      return `${valueName} must larger then 0`;
    }
  }

  return null;
}

export function checkInputAddress(address, addressName) {
  if (!address) {
    return `${addressName || "Address"} cannot be empty`;
  }

  if (!isAddress(address)) {
    return `Invalid ${addressName ? addressName.toLowerCase() : ""} address`;
  }

  return null;
}

import { stringUpperFirst } from "@polkadot/util";

const settings = [
  {
    host: "youtube.com",
    img: "youtube-logo.svg",
    name: "YouTube",
  },
  {
    host: "github.com",
    img: "github-logo.svg",
    name: "GitHub",
  },
  {
    host: "github.io",
    img: "github-logo.svg",
    name: "GitHub",
  },
  {
    host: "medium.com",
    img: "medium-logo.svg",
    name: "Medium",
  },
  {
    host: "polkassembly.io",
    img: "polkassembly-logo.svg",
    name: "Polkassembly",
  },
  {
    host: "twitter.com",
    img: "twitter-logo.svg",
    name: "Twitter",
  },
  {
    host: "t.me",
    img: "telegram-logo.svg",
    name: "Telegram",
  },
  {
    host: "docs.google.com",
    img: "google-doc-logo.svg",
    name: "Google Docs",
  },
  {
    host: "drive.google.com",
    img: "google-drive-logo.svg",
    name: "Google Drive",
  },
  {
    host: "opensquare.network",
    img: "opensquare-icon-logo.svg",
    name: "OpenSquare",
  },
  {
    host: "opensquare.io",
    img: "opensquare-icon-logo.svg",
    name: "OpenSquare",
  },
  {
    host: "dotreasury.com",
    img: "dotreasury-logo.svg",
    name: "doTreasury",
  },
  {
    host: "subsquare.io",
    img: "subsquare-logo.svg",
    name: "Subsquare",
  },
  {
    host: "matrix.to",
    img: "element-logo.svg",
    name: "Element",
  },
  {
    host: "subscan.io",
    img: "subscan-logo.svg",
    name: "Subscan",
  },
];

function getNameFromHost(host) {
  let name;
  [, name] = host.match(/([^.]*)(?:\.[a-z]+)?$/);
  if (["co", "com"].includes(name)) {
    const m = host.match(/([^.]*)(?:\.[a-z]+){2}$/);
    if (m) {
      [, name] = m;
    }
  }

  return stringUpperFirst(name);
}

export default function getLinkNameAndSrc(link) {
  let url;
  try {
    url = new URL(link);
  } catch (e) {
    return [];
  }

  if (url.protocol === "mailto:") {
    return ["Email", "/imgs/email-logo.svg"];
  }

  const setting = settings.find(setting => url.host.endsWith(setting.host));
  if (setting) {
    return [setting.name, `/imgs/${setting.img}`];
  }

  return [getNameFromHost(url.host), "/imgs/link-icon.svg"];
}

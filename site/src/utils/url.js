/**
 * @description ensure link protocol
 * @example google.com -> https://google.com
 */
export function ensureLinkProtocol(link = "", protocol = "https:") {
  const isExternal = isExternalLink(link);

  const value = isExternal
    ? link
    : {
        hostname: link,
        protocol,
      };

  return makeUrl(value);
}

/**
 * @description get url file extension, otherwise returns `''`
 * @example returns `.svg` or `svg`
 */
export function getUrlExtension(url = "", { dot = false } = {}) {
  const [u] = url.split("?");
  const [extWithDot, ext] = u.match(/\.([^.]+)$/) ?? [];

  if (dot) {
    return extWithDot;
  }

  return ext;
}

function isExternalLink(link = "") {
  return /^https?:\/\//.test(link);
}

/**
 * @param {URL | string} options
 */
function makeUrl(options) {
  if (typeof options === "string") {
    return options;
  }

  const { protocol = "https:", pathname = "/", hostname = "" } = options ?? {};

  return `${protocol}//${hostname}${pathname}`;
}

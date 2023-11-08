/**
 * @description compose subscan link
 * @example makeSubscanLink("kusama", "user", :address) -> "https://kusama.subscan.io/user/:address"
 */
export function makeSubscanLink(chain, ...pathnames) {
  const hostname = `${chain}.subscan.io`;

  return makeUrl({
    hostname,
    pathname: makeUrlPathname(...pathnames),
  });
}

export function makeSubsquareLink(chain, ...pathnames) {
  const hostname = `${chain}.subsquare.io`;

  return makeUrl({
    hostname,
    pathname: makeUrlPathname(...pathnames),
  });
}

export function makeStatescanLink(chain, ...pathnames) {
  const hostname = `${chain}.statescan.io`;

  return makeUrl({
    hostname,
    pathname: makeUrlPathname(...pathnames),
  });
}

export function makeInSiteTipLink(page, tipHeight, tipHash) {
  return makeUrlPathname(page, `${tipHeight}_${tipHash}`);
}

/**
 * @link `/:symbol/users/:address`
 * @description page user detail
 */
export function makeInSiteUserDetailLink(address, role, tableTab) {
  return makeUrlPathname("users", address, role, tableTab);
}

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

export function makeUrlPathname(...paths) {
  return "/" + paths.filter(Boolean).join("/");
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

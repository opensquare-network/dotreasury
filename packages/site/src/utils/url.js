export function makeSubsquareLink(chain, category, page, id) {
  const domain = `https://${chain}.subsquare.io`;

  const pathnames = [category, page];

  if (id) {
    pathnames.push(id);
  }

  const url = new URL(makeUrlPathname(...pathnames), domain);
  return url.toString();
}

export function makeInSiteTipLink(symbol, page, tipHeight, tipHash) {
  return makeUrlPathname(symbol, page, `${tipHeight}_${tipHash}`);
}

function makeUrlPathname(...path) {
  return "/" + path.join("/");
}

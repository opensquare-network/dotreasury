export function makeSubsquareLink(chain, category, page, id) {
  let url = `https://${chain}.subsquare.io/${category}/${page}`;

  if (id) {
    url += `/${id}`;
  }

  return url;
}

import { networkFromSymbol } from "@site/src/utils";

const pathname = location.pathname;
const paths = pathname.split("/").filter(Boolean);
const symbol = paths[0]?.toLowerCase?.() ?? "";
const routes = paths.slice(1);
const chain = networkFromSymbol(symbol);

export const shouldRedirect = !!chain;

export function redirect() {
  window.location.replace(
    `https://${chain}.dotreasury.com/#/${routes.join("/")}`,
  );
}

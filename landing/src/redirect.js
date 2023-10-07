import { networkFromSymbol } from "@site/src/utils";

export function redirect() {
  const pathname = location.pathname;
  const paths = pathname.split("/").filter(Boolean);
  const symbol = paths[0]?.toLowerCase?.();
  const routes = paths.slice(1);

  if (symbol) {
    const chain = networkFromSymbol(symbol);

    // if matched, then redirect
    if (chain) {
      window.location.replace(
        `https://${chain}.dotreasury.com/#/${routes.join("/")}`,
      );
    }
  }
}

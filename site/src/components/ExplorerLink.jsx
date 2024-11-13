import React from "react";
import { useSelector } from "react-redux";
import { chainSelector } from "../store/reducers/chainSlice";
import ExternalLink from "./ExternalLink";

export default function ExplorerLink({
  href,
  base,
  children,
  className = "",
  externalIcon = false,
}) {
  const chain = useSelector(chainSelector);
  const defaultExplorerSite = `https://${chain}.subscan.io/`;
  const baseHref = base ?? defaultExplorerSite;
  return (
    <ExternalLink
      href={new URL(href, baseHref).href}
      className={className}
      externalIcon={externalIcon}
    >
      {children}
    </ExternalLink>
  );
}

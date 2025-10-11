import React from "react";
import { useSelector } from "react-redux";
import { chainSelector } from "../store/reducers/chainSlice";
import ExternalLink from "./ExternalLink";
import { currentChainSettings } from "../utils/chains";
import isAssetHubMigrated from "../utils/isAssetHubMigrated";
import BigNumber from "bignumber.js";

export function getConditionalExplorerSite(chain, blockTime = null) {
  const { assethubMigration = null } = currentChainSettings;
  const defaultExplorerSite = `https://${chain}.subscan.io/`;
  if (!blockTime) {
    return defaultExplorerSite;
  }

  if (
    isAssetHubMigrated() &&
    new BigNumber(blockTime).isGreaterThanOrEqualTo(
      assethubMigration?.timestamp || 0,
    )
  ) {
    return `https://assethub-${chain}.subscan.io/`;
  }

  return defaultExplorerSite;
}

export default function ExplorerLink({
  href,
  base,
  children,
  className = "",
  externalIcon = false,
  externalIconColor = "textTertiary",
  externalIconSize = 16,
  blockTime = null,
}) {
  const chain = useSelector(chainSelector);
  const defaultExplorerSite = getConditionalExplorerSite(chain, blockTime);
  const baseHref = base ?? defaultExplorerSite;
  return (
    <ExternalLink
      href={new URL(href, baseHref).href}
      className={className}
      externalIcon={externalIcon}
      externalIconColor={externalIconColor}
      externalIconSize={externalIconSize}
    >
      {children}
    </ExternalLink>
  );
}

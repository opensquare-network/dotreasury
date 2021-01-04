import React from "react"
import ExternalLink from "./ExternalLink";

export default function ExplorerLink({ href, base, children}) {
  const baseHref = base ?? (process.env.REACT_APP_DEFAULT_EXPLORER_SITE || "https://kusama.subscan.io/");
  return <ExternalLink href={new URL(href, baseHref).href} children={children} />
}

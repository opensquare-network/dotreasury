import React from "react"

export default function ExplorerLink({ href, base, children}) {
  const baseHref = base ?? (process.env.REACT_APP_EXPLORER_SITE || "https://kusama.subscan.io/")
  return (
    <a
      href={new URL(href, baseHref).href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => { e.stopPropagation(); }}
    >
      {children}
    </a>
  );
}

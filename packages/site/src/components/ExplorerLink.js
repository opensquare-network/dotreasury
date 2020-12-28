import React from "react"

export default function ExplorerLink({ href, children}) {
  return (
    <a
      href={new URL(href, process.env.REACT_APP_EXPLORER_SITE || "https://kusama.subscan.io/").href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => { e.stopPropagation(); }}
    >
      {children}
    </a>
  );
}

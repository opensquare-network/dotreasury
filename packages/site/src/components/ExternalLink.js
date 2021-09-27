import React from "react"

export default function ExternalLink({ href, children }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => { e.stopPropagation(); }}
    >
      {children}
    </a>
  );
}

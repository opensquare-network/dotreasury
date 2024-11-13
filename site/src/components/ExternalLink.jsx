import React from "react";

export default function ExternalLink({
  href,
  children,
  className,
  externalIcon = false,
}) {
  return (
    <a
      href={href}
      title={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      {children}

      {externalIcon && (
        <>
          {" "}
          <span>↗</span>
        </>
      )}
    </a>
  );
}

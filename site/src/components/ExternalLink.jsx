import React from "react";
import IconMask from "./Icon/Mask";
import styled from "styled-components";

const Span = styled.span`
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  color: inherit;
`;

export default function ExternalLink({
  href,
  children,
  className,
  style,
  externalIcon = false,
  externalIconColor = "textTertiary",
  externalIconSize = 16,
}) {
  const handleClick = (e) => {
    e.stopPropagation();
    e.preventDefault();

    if (href) {
      window.open(href, "_blank", "noopener,noreferrer");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      handleClick(e);
    }
  };

  return (
    <Span
      title={href}
      style={style}
      className={className}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={href}
    >
      {children}

      {externalIcon && (
        <IconMask
          src="/imgs/caret-up-right.svg"
          color={externalIconColor}
          size={externalIconSize}
        />
      )}
    </Span>
  );
}

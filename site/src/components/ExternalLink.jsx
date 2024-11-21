import React from "react";
import IconMask from "./Icon/Mask";
import styled from "styled-components";

const A = styled.a`
  display: inline-flex;
  align-items: center;
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
  return (
    <A
      href={href}
      title={href}
      target="_blank"
      rel="noopener noreferrer"
      style={style}
      className={className}
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      {children}

      {externalIcon && (
        <IconMask
          src="/imgs/caret-up-right.svg"
          color={externalIconColor}
          size={externalIconSize}
        />
      )}
    </A>
  );
}

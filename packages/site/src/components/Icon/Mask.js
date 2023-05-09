import styled, { useTheme } from "styled-components";
import { inline_flex } from "../../styles/tailwindcss";
import React from "react";

const assertsize = (size) => (typeof size === "number" ? `${size}px` : size);

const I = styled.i`
  ${inline_flex};
  background-color: ${(p) => p.color};
  mask: url(${(p) => p.src}) no-repeat;
  mask-size: cover;
  width: ${(p) => assertsize(p.size)};
  height: ${(p) => assertsize(p.size)};
`;

/**
 * @param {{src: string, size: number, color: keyof ReturnType<useTheme>} & React.HtmlHTMLAttributes<HTMLElement>} props
 * @description use for pure color icon, e.g. system-sun.svg
 */
export default function IconMask({ src, color, size, ...restProps }) {
  const theme = useTheme();

  return (
    <I role="img" color={theme[color]} src={src} size={size} {...restProps} />
  );
}

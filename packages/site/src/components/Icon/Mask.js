import styled from "styled-components";
import { inline_flex } from "../../styles/tailwindcss";
import React from "react";
import { useTheme } from "../../context/theme";

const I = styled.i`
  ${inline_flex};
  background-color: ${(p) => p.color};
  mask: url(${(p) => p.src}) no-repeat;
  mask-size: cover;
  width: ${(p) => p.size}px;
  height: ${(p) => p.size}px;
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

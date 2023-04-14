import React from "react";
import styled, { css } from "styled-components";
import { p_12_medium } from "../../../styles/text";
import {
  TEXT_DARK_MAJOR,
  Greyscale_Grey_100,
  Primary_Theme_Pink_500,
  Primary_Theme_Pink_100,
} from "../../../constants";

const TagWrapper = styled.span`
  ${p_12_medium};
  color: var(--textPrimary);
  background-color: ${Greyscale_Grey_100};
  padding: 2px 12px;
  border-radius: 4px;

  ${(p) =>
    p.rounded &&
    css`
      border-radius: 9999px;
    `}

  ${(p) =>
    p.hoverable &&
    css`
      cursor: pointer;
      &:hover {
        opacity: 0.8;
      }
    `}

  ${(p) =>
    p.color === "pink" &&
    css`
      color: ${Primary_Theme_Pink_500};
      background-color: ${Primary_Theme_Pink_100};
    `}
  
  ${(p) =>
    p.size === "small" &&
    css`
      padding: 0 8px;
    `}

  & + & {
    margin-left: 8px;
  }
`;

/**
 * @param {React.HTMLAttributes<HTMLSpanElement> & {rounded?: boolean, hoverable?: boolean, color?: 'pink', size?: 'small'}} props
 * @description Tag for categorizing or markup.
 */
export default function Tag(props) {
  const {
    children,
    rounded = false,
    hoverable = false,
    color,
    size,
    ...restProps
  } = props ?? {};

  return (
    <TagWrapper
      rounded={rounded}
      hoverable={hoverable}
      color={color?.toString()}
      size={size}
      {...restProps}
    >
      {children}
    </TagWrapper>
  );
}

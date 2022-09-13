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
  color: ${TEXT_DARK_MAJOR};
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

  & + & {
    margin-left: 8px;
  }
`;

/**
 * @param {import('./types').TagProps} props
 * @description Tag for categorizing or markup.
 */
export default function Tag(props) {
  const {
    children,
    rounded = false,
    hoverable = false,
    color,
    ...restProps
  } = props ?? {};

  return (
    <TagWrapper
      rounded={rounded}
      hoverable={hoverable}
      color={color}
      {...restProps}
    >
      {children}
    </TagWrapper>
  );
}

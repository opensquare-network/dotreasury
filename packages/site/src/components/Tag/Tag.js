import styled, { css } from "styled-components";
import { p_12_medium } from "../../styles/text";
import { TEXT_DARK_MAJOR, Greyscale_Grey_100 } from "../../constants";

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

  & + & {
    margin-left: 8px;
  }
`;

/**
 * @description Tag for categorizing or markup.
 */
export default function Tag({ children, rounded }) {
  return <TagWrapper rounded={rounded}>{children}</TagWrapper>;
}

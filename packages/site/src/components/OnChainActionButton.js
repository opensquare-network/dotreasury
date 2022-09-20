import styled, { css } from "styled-components";
import { PRIMARY_THEME_COLOR } from "../constants";

const OnChainActionButton = styled.div`
  cursor: pointer;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 4px 8px;

  background: ${PRIMARY_THEME_COLOR};
  border-radius: 4px;

  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 16px;
  color: white;

  ${p => p.disabled ? css`
    color: white;
    background: #F292A4;
    opacity: 1;
  ` : css`
    :hover {
      background: #E75973;
    }
  `}
`;

export default OnChainActionButton;

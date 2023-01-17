import styled, { css } from "styled-components";
import OnChainActionButton from "./OnChainActionButton";

const OnChainActionButtonSecondary = styled(OnChainActionButton)`
  padding: 3px 7px;
  background: white;
  border: 1px solid #dddddd;

  color: rgba(0, 0, 0, 0.9);

  ${(p) =>
    p.disabled &&
    css`
      color: rgba(0, 0, 0, 0.15);
      pointer-events: none;
    `}
`;

export default OnChainActionButtonSecondary;

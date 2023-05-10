import styled, { css } from "styled-components";
import OnChainActionButton from "./OnChainActionButton";

const OnChainActionButtonSecondary = styled(OnChainActionButton)`
  padding: 3px 7px;
  background: transparent;
  border: 1px solid var(--neutral400);

  color: var(--textPrimary);

  ${(p) =>
    p.disabled &&
    css`
      color: var(--textDisable);
      pointer-events: none;
    `}
`;

export default OnChainActionButtonSecondary;

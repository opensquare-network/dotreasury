import styled, { css } from "styled-components";

const OnChainActionButton = styled.div`
  cursor: pointer;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 4px 8px;

  background: var(--primary);
  border-radius: 4px;

  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 16px;
  color: var(--textPrimaryContrast);

  white-space: nowrap;
  ${(p) =>
    p.disabled &&
    css`
      background: var(--neutral500);
      opacity: 1;
      pointer-events: none;
    `}
`;

export default OnChainActionButton;

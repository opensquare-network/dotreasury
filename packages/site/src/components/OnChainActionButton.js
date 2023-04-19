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
  color: white;

  white-space: nowrap;
  ${p => p.disabled && css`
    color: white;
    background: #CCCCCC;
    opacity: 1;
    pointer-events: none;
  `}
`;

export default OnChainActionButton;

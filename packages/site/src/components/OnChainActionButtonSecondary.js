import styled, { css } from "styled-components";

const OnChainActionButtonSecondary = styled.div`
  cursor: pointer;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 4px 8px;
  background-color: white;
  border: 1px solid #DDDDDD;
  border-radius: 4px;

  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 16px;
  color: rgba(0, 0, 0, 0.9);

  white-space: nowrap;
  ${p => p.disabled && css`
    color: rgba(0, 0, 0, 0.15);
    pointer-events: none;
  `}
`;

export default OnChainActionButtonSecondary;

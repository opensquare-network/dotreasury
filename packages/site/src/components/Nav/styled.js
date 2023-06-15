import styled, { css } from "styled-components";
import Text from "../../components/Text";

export const NavWrapper = styled.div`
  display: flex;
  gap: 32px;
`;

export const NavItem = styled(Text)`
  cursor: pointer;
  font-size: 16px;
  line-height: 24px;
  font-weight: 600;

  color: var(--textTertiary) !important;

  :hover {
    color: var(--textSecondary) !important;
  }

  ${(p) =>
    p.active &&
    css`
      color: var(--textPrimary) !important;
    `}
`;

export const NavLabel = styled.div`
  display: flex;
  align-items: center;

  div.ui.label {
    background: var(--secondary) !important;
    height: 20px !important;
    padding: 0 8px !important;
    line-height: 20px !important;
    border-radius: 10px !important;
    margin-left: 8px !important;
    color: var(--primary) !important;
    font-weight: 400;
  }
`;

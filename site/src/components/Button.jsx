import styled from "styled-components";
import { Button } from "semantic-ui-react";

const CustomButton = styled(Button)`
  margin: 0 !important;
  height: 40px !important;
  font-size: 14px !important;
  font-family: "Inter" !important;
  color: var(--textPrimary) !important;
  background: var(--neutral100) !important;
  border: 1px solid var(--neutral300) !important;
  border-radius: 4px !important;
  line-height: 24px !important;
  padding: 8px 16px !important;
  &.ui.button:hover,
  &.ui.button:active,
  &.ui.button:focus {
    border-color: var(--neutral500) !important;
  }
  &.ui.button:disabled {
    color: var(--textDisable) !important;
    opacity: 1 !important;
  }
`;

export default CustomButton;

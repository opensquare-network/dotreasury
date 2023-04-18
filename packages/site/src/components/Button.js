import styled from "styled-components";
import { Button } from "semantic-ui-react";


const CustomButton = styled(Button)`
  margin: 0 !important;
  height: 40px !important;
  font-size: 14px !important;
  font-family: "Inter" !important;
  color: var(--textPrimary) !important;
  background: white !important;
  border: 1px solid #e1e1e1 !important;
  border-radius: 4px !important;
  line-height: 24px !important;
  padding: 8px 16px !important;
  &.ui.button:hover,
  &.ui.button:active,
  &.ui.button:focus {
    border-color: #cccccc !important;
  }
  &.ui.button:disabled {
    color: rgba(29, 37, 60, 0.24) !important;
    opacity: 1 !important;
  }
`;

export default CustomButton;

import styled from "styled-components";

import Button from "./Button";

const ButtonPrimary = styled(Button)`
  border: 0 !important;
  color: var(--textPrimaryContrast) !important;
  background: var(--primary) !important;
  &.ui.button:disabled {
    color: var(--textPrimaryContrast) !important;
    background: var(--neutral500) !important;
    opacity: 1 !important;
  }
`;

export default ButtonPrimary;

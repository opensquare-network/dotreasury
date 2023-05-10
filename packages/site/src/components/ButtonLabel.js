import styled from "styled-components";

import Button from "./Button";

const ButtonLabel = styled(Button)`
  border: 0 !important;
  padding-left: 0 !important;
  padding-right: 0 !important;
  background-color: transparent !important;
  &.ui.button:hover {
    color: var(--primary) !important;
  }
  &.ui.button:disabled {
    color: var(--textDisable) !important;
  }
`;

export default ButtonLabel;

import styled from "styled-components";

import Button from "./Button";
import { PRIMARY_THEME_COLOR, TEXT_DARK_DISABLE } from "../constants";

const ButtonPrimary = styled(Button)`
  border: 0 !important;
  padding-left: 0 !important;
  padding-right: 0 !important;
  &.ui.button:hover {
    color: ${PRIMARY_THEME_COLOR} !important;
  }
  &.ui.button:disabled {
    color: ${TEXT_DARK_DISABLE} !important;
  }
`

export default ButtonPrimary;

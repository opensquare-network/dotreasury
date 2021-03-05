import styled from "styled-components";

import Button from "./Button";
import { PRIMARY_THEME_COLOR } from "../constants";

const ButtonPrimary = styled(Button)`
  border: 0 !important;
  color: white !important;
  background: ${PRIMARY_THEME_COLOR} !important;
  &.ui.button:hover {
    background: #E75973 !important;
  }
  &.ui.button:active {
    background: #C7304B !important;
  }
  &.ui.button:focus {
    background: #DF405D !important;
  }
  &.ui.button:disabled {
    color: white !important;
    background: #F292A4!important;
    opacity: 1 !important;
  }
`

export default ButtonPrimary;

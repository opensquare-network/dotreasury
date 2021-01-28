import styled from "styled-components";

import Button from "./Button";
import { PRIMARY_THEME_COLOR } from "../constants";

const ButtonPrimary = styled(Button)`
  border: 0 !important;
  color: white !important;
  background: ${PRIMARY_THEME_COLOR} !important;
`

export default ButtonPrimary;

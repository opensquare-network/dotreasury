import styled from "styled-components";
import { TextArea } from "semantic-ui-react";

import {PRIMARY_THEME_COLOR} from "../constants"

const CustomTextArea = styled(TextArea)`
  min-height: 100px !important;
  &:focus {
    border-color: ${PRIMARY_THEME_COLOR} !important;
  }
`

export default CustomTextArea

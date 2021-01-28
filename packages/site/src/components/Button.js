import styled from "styled-components";
import { Button } from "semantic-ui-react";

import { TEXT_DARK_MAJOR } from "../constants";

const CustomButton = styled(Button)`
  margin: 0 !important;
  height: 40px !important;
  font-size: 14px !important;
  font-family: "Inter" !important;
  font-weight: 400 !important;
  color: ${TEXT_DARK_MAJOR} !important;
  background: white !important;
  border: 1px solid #E1E1E1 !important;
  border-radius: 4px !important;
  line-height: 24px !important;
  padding: 8px 16px !important;
`

export default CustomButton;

import styled from "styled-components";
import { Input } from "semantic-ui-react";

const CustomInput = styled(Input)`
  input {
    padding: 8px 16px !important;
    min-height: 40px !important;
    :hover, :focus {
      border-color: #CCCCCC !important;
    }
  }
`

export default CustomInput;

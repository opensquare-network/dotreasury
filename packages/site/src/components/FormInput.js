import styled, { css } from "styled-components";

import { TEXT_DARK_MAJOR } from "../constants";

const FormInput = styled.input`
  height: 40px !important;
  padding: 8px 16px !important;
  line-height: 24px !important;
  font-family: "Inter" !important;
  font-size: 14px !important;
  color: ${TEXT_DARK_MAJOR} !important;
  :hover, :focus {
    border-color: #CCCCCC !important;
  }
  ${p => p.error && css`
    border-color: #EC4730 !important;
    :hover, :focus {
      border-color: #EC4730 !important;
    }
  `}
`

export default FormInput;

import styled from "styled-components";
import { Input } from "semantic-ui-react";

const CustomInput = styled(Input)`
  input {
    background-color: var(--neutral100) !important;
    padding: 8px 16px !important;
    min-height: 40px !important;
    color: var(--textPrimary) !important;
    border-color: var(--neutral300) !important;
    :hover,
    :focus {
      border-color: var(--neutral400) !important;
    }

    ::placeholder {
      color: var(--textSecondary) !important;
    }
    &:focus::placeholder {
      color: var(--textTertiary) !important;
    }
  }
`;

export default CustomInput;

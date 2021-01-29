import React from "react";
import styled from "styled-components";

import { StyledItem, StyledTitle } from "./components";
import TextMinor from "../../components/TextMinor";
import Button from "../../components/Button";

const StyledTextMinor = styled(TextMinor)`
  margin-bottom: 16px;
`

const StyledButton = styled(Button)`
  width: 100%;
`

const DeleteAccount = () => {
  return (
    <StyledItem>
      <StyledTitle>
        Delete account
      </StyledTitle>
      <StyledTextMinor>
        Once you delete  your account, there is no going back. Please be certain.
      </StyledTextMinor>
      <StyledButton>Delete my account</StyledButton>
    </StyledItem>
  )
}

export default DeleteAccount;

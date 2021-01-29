import React, { useState } from "react";
import styled from "styled-components";

import { StyledItem, StyledTitle, EditWrapper, EditButton, StyledInput } from "./components";

const StyledDiv = styled.div`
  margin-bottom: 24px;
`

const Password = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  return (
    <StyledItem>
      <StyledTitle>
        Current password
      </StyledTitle>
      <StyledDiv>
        <EditWrapper>
          <StyledInput
            type="password"
            placeholder="Please fill current password"
            value={currentPassword}
            onChange={({target: { value }}) => {
              setCurrentPassword(value)
            }} />
        </EditWrapper>
      </StyledDiv>
      <StyledTitle>
        New password
      </StyledTitle>
      <div>
        <EditWrapper>
          <StyledInput
            type="password"
            placeholder="Please fill new password"
            value={newPassword}
            onChange={({target: { value }}) => {
              setNewPassword(value)
            }} />
          <EditButton>Change</EditButton>
        </EditWrapper>
      </div>
    </StyledItem>
  )
}

export default Password;

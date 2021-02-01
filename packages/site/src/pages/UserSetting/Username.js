import React from "react";

import { StyledItem, StyledTitle, EditWrapper, StyledText } from "./components";

const Username = ({ username }) => {

  return (
    <StyledItem>
      <StyledTitle>
        Username
      </StyledTitle>
      <EditWrapper>
        <StyledText>{username}</StyledText>
      </EditWrapper>
    </StyledItem>
  )
}

export default Username;

import React, { useState } from "react";
import styled from "styled-components";

import { StyledItem, StyledTitle } from "./components";
import TextMinor from "../../components/TextMinor";
import Toggle from "../../components/Toggle";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const Notifications = () => {
  const [isChecked, setIsChecked] = useState(false);

  return (
    <StyledItem>
      <StyledTitle>
        Email notifications
      </StyledTitle>
      <Wrapper>
        <TextMinor>Subscribe to reply your comment.</TextMinor>
        <Toggle checked={isChecked} onClick={() => setIsChecked(!isChecked)} />
      </Wrapper>
    </StyledItem>
  )
}

export default Notifications;

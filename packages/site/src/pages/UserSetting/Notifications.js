import React, { useState } from "react";
import styled from "styled-components";
import { Checkbox } from 'semantic-ui-react'

import { StyledItem, StyledTitle } from "./components";
import TextMinor from "../../components/TextMinor";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 520px;
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
        <Checkbox toggle checked={isChecked} onClick={() => setIsChecked(!isChecked)} />
      </Wrapper>
    </StyledItem>
  )
}

export default Notifications;

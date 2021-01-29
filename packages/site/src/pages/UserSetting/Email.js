import React, { useState, useEffect, useRef } from "react";

import { StyledItem, StyledTitle, EditWrapper, StyledText, EditButton, StyledInput } from "./components";

const Email = ({ email }) => {
  const [isChange, setIsChange] = useState(false);
  const [editEmail, setEditEmail] = useState(email);
  const [password, setPassword] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    isChange && inputRef?.current?.focus();
  }, [isChange])

  return (
    <StyledItem>
      <StyledTitle>
        Email
      </StyledTitle>
      {!isChange && <div>
        <EditWrapper>
          <StyledText>{email}</StyledText>
          <EditButton onClick={() => {
            setIsChange(true);
          }}>Edit</EditButton>
        </EditWrapper>
      </div>}
      {isChange && <div>
        <EditWrapper>
          <StyledInput ref={inputRef} placeholder="Email" value={editEmail} onChange={({target: { value }}) => {
            setEditEmail(value)
          }} />
        </EditWrapper>
        <EditWrapper>
          <StyledInput type="password" placeholder="Please fill password" value={password} onChange={({target: { value }}) => {
            setPassword(value)
          }} />
          <EditButton>Change</EditButton>
        </EditWrapper>
      </div>}
    </StyledItem>
  )
}

export default Email;

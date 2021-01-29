import React, { useState, useEffect, useRef } from "react";

import { StyledItem, StyledTitle, EditWrapper, StyledText, EditButton, StyledInput } from "./components";

const Username = ({ username }) => {
  const [isChange, setIsChange] = useState(false);
  const [editUsername, setEditUsername] = useState(username);
  const [password, setPassword] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    isChange && inputRef?.current?.focus();
  }, [isChange])

  return (
    <StyledItem>
      <StyledTitle>
        Username
      </StyledTitle>
      {!isChange && <div>
        <EditWrapper>
          <StyledText>{username}</StyledText>
          <EditButton onClick={() => {
            setIsChange(true);
          }}>Edit</EditButton>
        </EditWrapper>
      </div>}
      {isChange && <div>
        <EditWrapper>
          <StyledInput ref={inputRef} placeholder="Username" value={editUsername} onChange={({target: { value }}) => {
            setEditUsername(value)
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

export default Username;

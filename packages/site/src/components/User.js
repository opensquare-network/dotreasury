import React from "react";
import styled from "styled-components";
import { Image } from "semantic-ui-react";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
`;

const UserImage = styled(Image)`
  border-radius: 50%;
  border: 1px solid #e1e1e1;
  width: 24px;
  height: 24px;
`;

const UserName = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  font-family: Roboto Mono;
  font-size: 14px;
  color: rgba(29, 37, 60, 0.64);
`;

const User = ({ name, src }) => {
  return (
    <Wrapper>
      <UserImage src={src ? src : "./imgs/avatar.png"} />
      <UserName>{name}</UserName>
    </Wrapper>
  );
};

export default User;

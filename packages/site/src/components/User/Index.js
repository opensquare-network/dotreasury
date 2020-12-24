import React from "react";
import styled from "styled-components";
import { Image } from "semantic-ui-react";

import Username from "./Username";

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

const User = ({ name, address, src }) => {
  return (
    <Wrapper>
      <UserImage src={src ? src : "./imgs/avatar.png"} />
      <Username name={name} address={address} />
    </Wrapper>
  );
};

export default User;

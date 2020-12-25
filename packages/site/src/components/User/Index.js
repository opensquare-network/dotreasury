import React from "react";
import styled from "styled-components";

import Username from "./Username";
import Avatar from "./Avatar";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
`;

const User = ({ name, address, src }) => {
  return (
    <Wrapper>
      <Avatar address={address} />
      <Username name={name} address={address} />
    </Wrapper>
  );
};

export default User;

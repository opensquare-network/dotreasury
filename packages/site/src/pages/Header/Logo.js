import React from "react";
import styled from "styled-components";
import { Image } from "semantic-ui-react";

const Wrapper = styled.div`
  height: 32px;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Title = styled.span`
  font-family: Montserrat;
  font-weight: bold;
  font-size: 18px;
  line-height: 32px;
  color: #df405d;
`;

const Logo = () => (
  <Wrapper>
    <Image src="./imgs/logo.svg" />
    <Title>doTreasury</Title>
  </Wrapper>
);

export default Logo;

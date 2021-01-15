import React from "react";
import styled from "styled-components";
import { Image } from "semantic-ui-react";

const Wrapper = styled.div`
  height: 32px;
  display: flex;
  align-items: center;
`;

const Logo = () => (
  <Wrapper>
    <Image src="/imgs/al-logo.svg" />
  </Wrapper>
);

export default Logo;

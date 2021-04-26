import React from "react";
import styled from "styled-components";
import { Image } from "semantic-ui-react";

const Wrapper = styled.div`
  height: 32px;
  display: flex;
  align-items: center;
`;

const Logo = ({ symbol }) => (
  <Wrapper>
    <Image
      src={symbol === "ksm" ? `/imgs/logo-white.svg` : `/imgs/logo-black.svg`}
    />
  </Wrapper>
);

export default Logo;

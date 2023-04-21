import React from "react";
import styled from "styled-components";
import { Image } from "semantic-ui-react";
import { useDark } from "../../context/theme";

const Wrapper = styled.div`
  height: 32px;
  display: flex;
  align-items: center;
`;

const ImgFullWrapper = styled.div`
  display: block;
  @media screen and (max-width: 390px) {
    display: none;
  }
`;

const ImgShortWrapper = styled.div`
  display: none;
  @media screen and (max-width: 390px) {
    display: block;
  }
`;

const Logo = ({ symbol }) => {
  const dark = useDark();

  return (
    <Wrapper>
      <ImgFullWrapper>
        <Image
          src={
            symbol === "ksm" || dark
              ? "/imgs/logo-white.svg"
              : "/imgs/logo-black.svg"
          }
        />
      </ImgFullWrapper>
      <ImgShortWrapper>
        <Image src="/imgs/logo.svg" width={32} />
      </ImgShortWrapper>
    </Wrapper>
  );
};

export default Logo;

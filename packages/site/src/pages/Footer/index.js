import React from "react";
import styled from "styled-components";
import { Icon, Image } from "semantic-ui-react";

import Container from "../../components/Container";
import TextMinor from "../../components/TextMinor";
import { TEXT_DARK_MAJOR, TEXT_DARK_MINOR } from "../../constants";

const Wrapper = styled.footer`
  padding-bottom: 20px;
`;

const FooterWrapper = styled.div`
  display: flex;
  align-items: center;
  > :not(:first-child) {
    margin-left: 24px;
  }
  > :last-child {
    margin-left: auto;
  }
  .link {
    cursor: pointer;
    :hover {
      color: ${TEXT_DARK_MAJOR};
      text-decoration: underline;
    }
  }
  .small {
    display: none;
    margin-bottom: 4px;
  }
  @media screen and (max-width: 1140px) {
    flex-direction: column;
    justify-content: center;
    > * {
      margin: 0 !important;
    }
    > :not(:first-child) {
      margin-top: 4px !important;
    }
    > :last-child {
      margin: 4px auto 0 !important;
    }
    .hidden {
      display: none;
    }
    .small {
      display: block;
    }
  }
`;

const IconList = styled.div`
  margin-left: auto !important;
  display: inline-flex;
  > :not(:first-child) {
    margin-left: 16px;
  }
  i {
    font-size: 20px;
    color: rgba(29, 37, 60, 0.24);

    &:hover {
      color: ${TEXT_DARK_MINOR};
    }
  }
`;

const ImageLogoWrapper = styled.div`
  display: flex;
  align-items: center;
  > :not(:first-child) {
    margin-left: 8px;
  }
  @media screen and (max-width: 481px) {
    flex-direction: column;
    > :not(:first-child) {
      margin-left: 0;
      margin-top: 4px;
    }
  }
`;

const FlexWrapper = styled.div`
  display: flex;
  align-items: center;
  > :not(:first-child) {
    margin-left: 8px;
  }
`;

const Footer = () => {
  return (
    <Wrapper>
      <Container>
        <FooterWrapper>
          <ImageLogoWrapper>
            <TextMinor>
              doTreasury © {new Date().getFullYear()} - Powered By
            </TextMinor>
            <a
              href="https://www.opensquare.network/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image src="/imgs/opensquare-logo.svg" />
            </a>
          </ImageLogoWrapper>
          <ImageLogoWrapper>
            <TextMinor>Funded by</TextMinor>
            <FlexWrapper>
              <a
                href="https://kusama.network/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image src="/imgs/kusama-treasury-logo.svg" />
              </a>
              <a
                href="https://polkadot.network/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image src="/imgs/polkadot-treasury-logo.svg" />
              </a>
            </FlexWrapper>
          </ImageLogoWrapper>
          <IconList>
            <a
              href="mailto:yongfeng@opensquare.network"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Icon name="mail" />
            </a>
            <a
              href="https://github.com/opensquare-network"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Icon name="github" />
            </a>
            <a
              href="https://t.me/dotreasury"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Icon name="telegram plane" />
            </a>
          </IconList>
        </FooterWrapper>
      </Container>
    </Wrapper>
  );
};

export default Footer;

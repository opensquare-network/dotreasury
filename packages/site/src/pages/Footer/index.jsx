import React from "react";
import styled from "styled-components";
import { Icon } from "semantic-ui-react";

import Container from "../../components/Container";
import TextMinor from "../../components/TextMinor";
import { items_center } from "../../styles/tailwindcss";
import FooterSwitchThemeButton from "./SwitchThemeButton";
import ImageWithDark from "../../components/ImageWithDark";

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
      color: var(--textPrimary);
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
  display: flex;
  ${items_center};
  > :not(:first-child) {
    margin-left: 16px;
  }
  i {
    font-size: 20px;
    color: var(--textDisable);

    &:hover {
      color: var(--textSecondary);
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
              <ImageWithDark src="/imgs/opensquare-logo.svg" />
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
                <ImageWithDark src="/imgs/kusama-treasury-logo.svg" />
              </a>
              <a
                href="https://polkadot.network/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <ImageWithDark src="/imgs/polkadot-treasury-logo.svg" />
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

            <FooterSwitchThemeButton />
          </IconList>
        </FooterWrapper>
      </Container>
    </Wrapper>
  );
};

export default Footer;

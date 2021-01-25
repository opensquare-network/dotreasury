import React from "react";
import styled, { css } from "styled-components";
import { Icon, Image } from "semantic-ui-react";

import Container from "../../components/Container";
import TextMinor from "../../components/TextMinor";
import {TEXT_DARK_MAJOR, TEXT_DARK_MINOR} from "../../constants";
import { mrgap } from "../../styles";

const Wrapper = styled.footer`
  background: #fff;
  height: 64px;
  border-top: 1px solid #eee;
`;

const FooterWrapper = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
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
    .hidden {
      display: none;
    }
    .small {
      display: block;
    }
  }
`;

const TextWrapper = styled.div`
  display: flex;
  ${css`${mrgap("32px")}`}
  align-items: center;
`

const IconList = styled.div`
  display: inline-flex;
  ${css`${mrgap("16px")}`}
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
  ${css`${mrgap("8px")}`}
  align-items: center;
`

const Footer = () => {
  return (
    <Wrapper>
      <Container>
        <FooterWrapper>
          <TextWrapper className="hidden">
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
              <TextMinor>
                Funded by
              </TextMinor>
                <a
                  href="https://kusama.network/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image src="/imgs/kusama-treasury-logo.svg" />
                </a>
            </ImageLogoWrapper>
          </TextWrapper>
          <TextMinor className="small">
            doTreasury © {new Date().getFullYear()} - Powered By OpenSquare
          </TextMinor>
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

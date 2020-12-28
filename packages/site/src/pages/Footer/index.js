import React from "react";
import styled from "styled-components";
import { Icon } from "semantic-ui-react";

import Container from "../../components/Container";
import TextMinor from "../../components/TextMinor";
import {TEXT_DARK_MAJOR} from "../../constants"
import {TEXT_DARK_MINOR} from "../../constants"

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
  @media screen and (max-width: 1140px) {
    flex-direction: column;
    justify-content: center;
    gap: 4px;
    .hidden {
      display: none;
    }
  }
`;

const TextWrapper = styled.div`
  display: flex;
  gap: 32px;
  align-items: center;
`

const IconList = styled.div`
  display: inline-flex;
  gap: 16px;
  i {
    font-size: 20px;
    color: rgba(29, 37, 60, 0.24);

    &:hover {
      color: ${TEXT_DARK_MINOR};
    }
  }
`;

const Footer = () => {
  return (
    <Wrapper>
      <Container>
        <FooterWrapper>
          <TextWrapper>
            <TextMinor>
              doTreasury © {new Date().getFullYear()} - Powered By OpenSquare
            </TextMinor>
            <TextWrapper className="hidden">
              <TextMinor className="link">
                Version history
              </TextMinor>
              <TextMinor className="link">
                Privacy policy
              </TextMinor>
              <TextMinor className="link">
                Terms of use
              </TextMinor>
            </TextWrapper>
          </TextWrapper>
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
              href="https://t.me/opensquare"
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

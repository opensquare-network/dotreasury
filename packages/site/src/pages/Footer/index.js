import React from "react";
import styled from "styled-components";
import { Icon } from "semantic-ui-react";

import Container from "../../components/container";

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
`;

const Label = styled.div`
  color: rgba(29, 37, 60, 0.24);
`;

const IconList = styled.div`
  display: inline-flex;
  gap: 20px;
  i {
    font-size: 20px;
    color: rgba(29, 37, 60, 0.24);

    &:hover {
      color: rgba(29, 37, 60, 0.64);
    }
  }
`;

const Footer = () => {
  return (
    <Wrapper>
      <Container>
        <FooterWrapper>
          <Label>
            © {new Date().getFullYear()} dotreasury. All Rights Reserved.
          </Label>
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

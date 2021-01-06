import React from "react";
import styled from "styled-components";
import { Image } from "semantic-ui-react";

import TextMinor from "../../components/TextMinor"
import { TEXT_DARK_MAJOR } from "../../constants";

const Wrapper = styled.div`
  display: flex;
  align-items: start;
  gap: 32px;
`;

const LinkWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const LinkText = styled(TextMinor)`
  cursor: pointer;
  line-height: 24px;
  &:hover {
    color: ${TEXT_DARK_MAJOR};
    text-decoration-line: underline;
  }
`;

const Link = ({ src, text, description }) => {
  return (
    <Wrapper>
      <LinkWrapper>
        <Image src={src} />
        <TextMinor>{text}</TextMinor>
      </LinkWrapper>
      <LinkText>{description}</LinkText>
    </Wrapper>
  );
};

export default Link;

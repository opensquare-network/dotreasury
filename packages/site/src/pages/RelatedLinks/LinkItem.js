import React from "react";
import styled from "styled-components";
import { Image } from "semantic-ui-react";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 32px;
`;

const LinkWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Text = styled.div`
  color: rgba(29, 37, 60, 0.64);
`;

const Link = ({ src, text, description }) => {
  return (
    <Wrapper>
      <LinkWrapper>
        <Image src={src} />
        <Text>{text}</Text>
      </LinkWrapper>
      <Text>{description}</Text>
    </Wrapper>
  );
};

export default Link;

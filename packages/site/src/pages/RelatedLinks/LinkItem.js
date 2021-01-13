import React from "react";
import styled from "styled-components";
import { Image } from "semantic-ui-react";
import ExternalLink from "../../components/ExplorerLink";

import TextMinor from "../../components/TextMinor"
import { TEXT_DARK_MAJOR } from "../../constants";
import { getLinkNameAndSrc } from "../../utils";

const Wrapper = styled.div`
  display: flex;
  align-items: start;
  gap: 32px;
`;

const LinkWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 140px;
`;

const LinkText = styled(TextMinor)`
  cursor: pointer;
  line-height: 24px;
  &:hover {
    color: ${TEXT_DARK_MAJOR};
    text-decoration-line: underline;
  }
`;

const Link = ({ link, text }) => {
  const [name, src] = getLinkNameAndSrc(link);

  return (
    <Wrapper>
      <ExternalLink href={link}>
        <LinkWrapper>
          <Image src={src} />
          <TextMinor>{name}</TextMinor>
        </LinkWrapper>
      </ExternalLink>
      <LinkText>{text}</LinkText>
    </Wrapper>
  );
};

export default Link;

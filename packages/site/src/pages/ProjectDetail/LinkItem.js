import React from "react";
import styled from "styled-components";
import { Image } from "semantic-ui-react";
import ExternalLink from "../../components/ExternalLink";

import TextMinor from "../../components/TextMinor"
import { TEXT_DARK_MAJOR } from "../../constants";
import { getLinkNameAndSrc } from "../../utils";

const Wrapper = styled.div`
  margin-bottom: 8px;
  :last-child {
    margin-bottom: 16px;
  }
`;

const LinkWrapper = styled.div`
  display: flex;
  align-items: center;

  & > :first-child {
    margin-right: 8px;
  }
`

const LinkText = styled(TextMinor)`
  line-height: 24px;
  &:hover {
    color: ${TEXT_DARK_MAJOR};
    text-decoration-line: underline;
  }
`;

const Link = ({ link }) => {
  const [, src] = getLinkNameAndSrc(link);

  return (
    <Wrapper>
      <ExternalLink href={link}>
        <LinkWrapper>
          <Image src={src} width={24} />
          <LinkText>{link}</LinkText>
        </LinkWrapper>
      </ExternalLink>
    </Wrapper>
  );
};

export default Link;

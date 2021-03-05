import React from "react";
import styled, { css } from "styled-components";
import { Image } from "semantic-ui-react";
import ExternalLink from "./ExternalLink";

import TextMinor from "./TextMinor"
import { TEXT_DARK_MAJOR } from "../constants";
import { getLinkNameAndSrc } from "../utils";
import { mrgap } from "../styles";

const Wrapper = styled.div`
  display: flex;
  align-items: start;
  ${css`${mrgap("32px")}`}
`;

const LinkWrapper = styled.div`
  display: flex;
  align-items: center;
  ${css`${mrgap("8px")}`}
  min-width: 140px;
`;

const LinkText = styled(TextMinor)`
  word-break: break-word;
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
      <ExternalLink href={link}>
        <LinkText>{text}</LinkText>
      </ExternalLink>
    </Wrapper>
  );
};

export default Link;

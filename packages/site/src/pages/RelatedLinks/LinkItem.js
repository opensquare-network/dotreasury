import React from "react";
import styled from "styled-components";
import { Image } from "semantic-ui-react";
import { stringUpperFirst } from "@polkadot/util";
import ExternalLink from "../../components/ExplorerLink";

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

const Link = ({ link, text }) => {
  const url = new URL(link);

  let src = "";
  if (url.host.endsWith("youtube.com")) {
    src = "/imgs/youtube-logo.png";
  } else if (url.host.endsWith("github.com")) {
    src = "/imgs/youtube-logo.png";
  } else if (url.host.endsWith("medium.com")) {
    src = "/imgs/medium-logo.png";
  } else if (url.host.endsWith("polkassembly.io")) {
    src = "/imgs/polkassembly-logo.svg";
  } else {
    src = "/imgs/youtube-logo.png";
  }

  let [, name] = url.host.match(/([^.]*)\.[a-z]+$/);
  name = stringUpperFirst(name);

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

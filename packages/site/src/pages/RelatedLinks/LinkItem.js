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
  let name = "";
  if (url.host.endsWith("youtube.com") || url.host.endsWith("youtu.be")) {
    src = "/imgs/youtube-logo.svg";
    name = "YouTube";
  } else if (url.host.endsWith("github.com") || url.host.endsWith("github.io")) {
    src = "/imgs/github-logo.svg";
    name = "GitHub";
  } else if (url.host.endsWith("medium.com")) {
    src = "/imgs/medium-logo.svg";
    name = "Medium";
  } else if (url.host.endsWith("polkassembly.io")) {
    src = "/imgs/polkassembly-logo.svg";
    name = "Polkassembly";
  } else if (url.host.endsWith("twitter.com")) {
    src = "/imgs/twitter-logo.svg";
    name = "Twitter";
  } else {
    src = "/imgs/youtube-logo.svg";
  }

  if (!name) {
    [, name] = url.host.match(/([^.]*)\.[a-z]+$/);
    name = stringUpperFirst(name);
  }

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

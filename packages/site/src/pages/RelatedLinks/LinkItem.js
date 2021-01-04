import React from "react";
import styled from "styled-components";
import { Image } from "semantic-ui-react";
import { stringUpperFirst } from "@polkadot/util";
import ExternalLink from "../../components/ExplorerLink";

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
          <Text>{name}</Text>
        </LinkWrapper>
      </ExternalLink>
      <Text>{text}</Text>
    </Wrapper>
  );
};

export default Link;

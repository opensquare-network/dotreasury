import React from "react";
import styled from "styled-components";
import { Image } from "semantic-ui-react";
import ExternalLink from "./ExternalLink";

import Table from "../components/Table";
import TextMinor from "./TextMinor";
import { getLinkNameAndSrc } from "../utils";

const FlexWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const LinkWrapper = styled.div`
  display: flex;
  align-items: center;
  width: 440px;
  > :not(:first-child) {
    margin-left: 8px;
  }
  @media screen and (max-width: 1140px) {
    width: 100%;
  }
`;

const LinkText = styled(TextMinor)`
  word-break: break-word;
  cursor: pointer;
  line-height: 24px;
  color: #086de3;
  &:hover {
    text-decoration-line: underline;
  }
`;

const Link = ({ link, text, button }) => {
  const [name, src] = getLinkNameAndSrc(link);

  return (
    <Table.Row>
      <Table.Cell>
        <FlexWrapper>
          <LinkWrapper>
            <Image src={src} />
            <TextMinor>{name}</TextMinor>
            {button}
          </LinkWrapper>
          <ExternalLink href={link}>
            <LinkText>{text}</LinkText>
          </ExternalLink>
        </FlexWrapper>
      </Table.Cell>
    </Table.Row>
  );
};

export default Link;

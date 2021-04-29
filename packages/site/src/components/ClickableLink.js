import React from "react";
import styled from "styled-components";

import ExternalLink from "./ExternalLink";
import { getLinkNameAndSrc } from "../utils";

const CustomImage = styled.img`
  position: relative;
  top: 4px;
  width: 20px;
`;

const LinkWrapper = styled.span`
  display: inline-flex;
  align-items: center;
  margin-left: 8px;
  &:first-child {
    margin-left: 15px;
  }
`;

const Wrapper = styled.div`
  word-wrap: break-word;
`;

const ClickableLink = ({ children, links }) => {
  return (
    <Wrapper>
      {children}
      {links &&
        links
          .filter((item) => item.inReasons)
          .map((item, index) => {
            const [, src] = getLinkNameAndSrc(item.link);
            return (
              <LinkWrapper key={index}>
                <ExternalLink href={item.link}>
                  <CustomImage src={src} />
                </ExternalLink>
              </LinkWrapper>
            );
          })}
    </Wrapper>
  );
};

export default ClickableLink;

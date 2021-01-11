import React from "react";
import styled from "styled-components";

import ExternalLink from "./ExternalLink";
import { getLinkNameAndSrc } from "../utils";

const CustomImage = styled.img`
  position: relative;
  top: 4px;
  width: 20px;
`

const Wrapper = styled.span`
  display: inline-flex;
  align-items: center;
  margin-left: 8px;
  &:first-child {
    margin-left: 15px;
  }
`

const ClickableLink = ({children, links}) => {
  return (
    <>
      {children}
      {
        links && links.filter(item => item.inReasons).map((item, index) => {
          const [, src] = getLinkNameAndSrc(item.link);
          return(
            <Wrapper key={index}>
              <ExternalLink href={item.link}><CustomImage src={src} /></ExternalLink>
            </Wrapper>
          )
        })
      }
    </>
  )
}

export default ClickableLink;

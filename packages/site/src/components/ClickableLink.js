import React from "react";
import styled from "styled-components";

import ExternalLink from "./ExternalLink";
import { getLinkNameAndSrc } from "../utils";

const CustomImage = styled.img`
  position: relative;
  top: 3px;
  width: 16px;
`

const Wrapper = styled.div`
  display: inline-flex;
  align-items: center;
  margin: 0 2px;
`

const ClickableLink = ({children, links}) => {
  return (
    <>
      {children}
      {
        links && links.filter(item => item.inReasons).map((item, index) => {
          const [, src] = getLinkNameAndSrc(item.link);
          return(
            <Wrapper>
              <ExternalLink href={item.link} key={index}><CustomImage src={src} /></ExternalLink>
            </Wrapper>
          )
        })
      }
    </>
  )
}

export default ClickableLink;

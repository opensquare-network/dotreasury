import React from "react";
import styled from "styled-components";

import ExternalLink from "./ExternalLink";
import { getLinkNameAndSrc } from "../utils";

const CustomImage = styled.img`
  display: inline;
  width: 14px;
  height: 14px;
  margin-left: 2px;
`

const ClickableLink = ({children, links}) => {
  return (
    <>
      {children}
      {
        links && links.filter(item => item.inReasons).map((item, index) => {
          const [, src] = getLinkNameAndSrc(item.link);
          return(<ExternalLink href={item.link} key={index}><CustomImage src={src} /></ExternalLink>)
        })
      }
    </>
  )
}

export default ClickableLink;

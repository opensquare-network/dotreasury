import React from "react";
import styled from "styled-components";

import ExternalLink from "./ExternalLink";

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
        links && links.map((item, index) => <ExternalLink href={item.link} key={index}><CustomImage src="/imgs/link-icon.svg" /></ExternalLink>)
      }
    </>
  )
}

export default ClickableLink;

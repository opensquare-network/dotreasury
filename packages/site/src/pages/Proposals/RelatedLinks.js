import React from "react";
import styled from "styled-components";
import { Image } from "semantic-ui-react";

import ExternalLink from "../../components/ExternalLink";
import { getLinkNameAndSrc } from "../../utils";

const Wrapper = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`

const CustomImage = styled(Image)`
  width: 20px;
`

const RelatedLinks = ({links}) => {
  return (
    <Wrapper>
      {(links || []).map((item, index) => {
        const [, src] = getLinkNameAndSrc(item.link)
        return (
          <ExternalLink href={item.link} key={index}><CustomImage src={src} /></ExternalLink>
        )
      })}
    </Wrapper>
  )
}

export default RelatedLinks;

import React from "react";
import styled, { css } from "styled-components";
import { Image, Popup } from "semantic-ui-react";

import ExternalLink from "./ExternalLink";
import { getLinkNameAndSrc } from "../utils";
import { useDisablePopup } from "../utils/hooks";
import { mrgap } from "../styles";

const Wrapper = styled.div`
  display: flex;
  ${css`${mrgap("8px")}`}
  align-items: center;
`

const CustomImage = styled(Image)`
  width: 20px;
`

const RelatedLinks = ({ links }) => {
  const disabledPopup = useDisablePopup()
  return (
    <Wrapper>
      {(links || []).map((item, index) => {
        const [, src] = getLinkNameAndSrc(item.link)
        return (
          <Popup
            content={item.description}
            size='mini'
            disabled={disabledPopup || !item.description}
            trigger={<div><ExternalLink href={item.link}><CustomImage src={src} /></ExternalLink></div>}
            key={index}
          />
        )
      })}
    </Wrapper>
  )
}

export default RelatedLinks;

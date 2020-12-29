import React from "react";
import styled from "styled-components";
import {Image} from "semantic-ui-react";

const Wrapper = styled.div`
  width: 16px;
  height: 16px;
  background: ${p => p.isJuge ? "#008000" : "#eeedec"};
  border-radius: 50%;
  padding: 3px;
`

const Badge = ({isJuge, hasParent, isNull = true}) => {
  if (isNull) return null;
  const imgSrc = isJuge ? hasParent ? "/imgs/badge-link.svg" : "/imgs/badge-check.svg" : hasParent ? "/imgs/badge-link-gray.svg" : "/imgs/badge-minus.svg"
  return (
    <Wrapper isJuge={isJuge}>
      <Image src={imgSrc} />
    </Wrapper>
  )
}

export default Badge;



import React from "react";
import styled from "styled-components";
import {Image} from "semantic-ui-react";

const Wrapper = styled.div`
  width: 16px;
  height: 16px;
  background: ${p => p.hasJudgement ? "#008000" : "#eeedec"};
  border-radius: 50%;
  padding: 3px;
`

const Badge = ({isDisplay ,hasParent , hasJudgement}) => {
  if (!isDisplay) return null;
  const imgSrc = hasJudgement ? hasParent ? "/imgs/badge-link.svg" : "/imgs/badge-check.svg" : hasParent ? "/imgs/badge-link-gray.svg" : "/imgs/badge-minus.svg"
  return (
    <Wrapper hasJudgement={hasJudgement}>
      <Image src={imgSrc} />
    </Wrapper>
  )
}

export default Badge;



import React from "react";
import styled from "styled-components";
import { Image } from "semantic-ui-react";

const Wrapper = styled.div`
  width: 16px;
  height: 16px;
  background: ${(p) => p.color};
  border-radius: 50%;
  padding: 3px;
`;

const Badge = ({ isDisplay, color, icon }) => {
  if (!isDisplay) return null;
  const imgSrc = `/imgs/badge-${icon}.svg`;
  return (
    <Wrapper color={color}>
      <Image src={imgSrc} />
    </Wrapper>
  );
};

export default Badge;

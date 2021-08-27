import React from "react";
import styled from "styled-components";
import { Image } from "semantic-ui-react";

const Wrapper = styled.div`
  > img {
    width: 18px;
    height: 18px;
  }
`;

const Badge = ({ isDisplay, icon }) => {
  if (!isDisplay) return null;
  const imgSrc = `/imgs/badge-icons/${icon}.svg`;
  return (
    <Wrapper>
      <Image src={imgSrc} />
    </Wrapper>
  );
};

export default Badge;

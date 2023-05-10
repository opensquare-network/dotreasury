import React from "react";
import styled from "styled-components";
import IconMask from "./Icon/Mask";

const Wrapper = styled.div`
  cursor: pointer;
`;

const RightButton = () => {
  return (
    <Wrapper>
      <IconMask src="/imgs/right-arrow.svg" size={24} color="textTertiary" />
    </Wrapper>
  );
};

export default RightButton;

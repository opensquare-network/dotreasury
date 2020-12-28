import React from "react";
import styled from "styled-components";
import { Image } from "semantic-ui-react";

const Wrapper = styled.div`
  cursor: pointer;
`;

const RightButton = () => {
  return (
    <Wrapper>
      <Image src="/imgs/right-arrow.svg" width={"24px"} height={"24px"} />
    </Wrapper>
  );
};

export default RightButton;

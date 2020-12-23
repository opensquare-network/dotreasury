import React from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  width: 24px;
  height: 24px;
  padding: 6px;
  div {
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    border: 3px solid #df405d;
    border-radius: 50%;
  }
`;

const Circle = () => {
  return (
    <>
      <Wrapper>
        <div />
      </Wrapper>
    </>
  );
};

export default Circle;

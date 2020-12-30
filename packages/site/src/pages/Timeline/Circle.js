import React from "react";
import styled from "styled-components";

import { PRIMARY_THEME_COLOR } from "../../constants";

const Wrapper = styled.div`
  width: 24px;
  height: 24px;
  padding: 6px;
  div {
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    border: 3px solid ${PRIMARY_THEME_COLOR};
    border-radius: 50%;
  }
  flex: 0 0 auto;
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

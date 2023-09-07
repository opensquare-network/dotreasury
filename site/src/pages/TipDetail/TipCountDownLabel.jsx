import React from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  text-align: right;
  span {
    margin-left: 8px;
    color: rgba(29, 37, 60, 0.64);
  }
`;

const TipCountDownLabel = ({ scanHeight, closes }) => {
  return (
    <Wrapper>
      {scanHeight > closes ? closes : `${scanHeight}/${closes}`}
    </Wrapper>
  );
};

export default TipCountDownLabel;

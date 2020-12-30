import React from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  min-width: 100px;
  text-align: right;
  span {
    margin-left: 8px;
    color: rgba(29, 37, 60, 0.64);
  }
`;

const TipCountDownLabel = ({ value, total }) => {
  return (
    <Wrapper>
      {value}/{total}
    </Wrapper>
  );
};

export default TipCountDownLabel;

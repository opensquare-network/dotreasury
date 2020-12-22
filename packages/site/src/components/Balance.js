import React from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  span:last-child {
    margin-left: 8px;
    color: rgba(29, 37, 60, 0.64);
  }
`;

const Balance = ({ value = 0, currency = "OSN" }) => {
  return (
    <Wrapper>
      <span>{value}</span>
      <span>{currency}</span>
    </Wrapper>
  );
};

export default Balance;

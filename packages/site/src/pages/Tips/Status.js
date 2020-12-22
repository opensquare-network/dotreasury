import React from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  span:first-child {
    font-family: Inter;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 24px;
    color: #1d253c;
  }
  span:last-child {
    font-family: Inter;
    font-style: normal;
    font-weight: normal;
    font-size: 12px;
    line-height: 20px;
    color: rgba(29, 37, 60, 0.64);
  }
`;

const Status = ({ status, time }) => {
  return (
    <Wrapper>
      <span>{status}</span>
      <span>{time}</span>
    </Wrapper>
  );
};

export default Status;

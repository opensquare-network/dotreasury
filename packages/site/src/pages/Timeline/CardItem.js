import React from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  display: flex;
  padding: 4px 16px;
  align-item: center;
  gap: 8px;
  div:first-child {
    width: 120px;
    color: #1d253c;
    font-weight: 500;
    line-height: 24px;
  }
  div:last-child {
    flex-grow: 1;
  }
`;

const CardItem = ({ title, children }) => {
  return (
    <Wrapper>
      <div>{title}</div>
      <div>{children}</div>
    </Wrapper>
  );
};

export default CardItem;

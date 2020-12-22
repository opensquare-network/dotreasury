import React from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  display: flex;
  & > div:first-child {
    font-family: Inter;
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 24px;
    color: #1d253c;
    flex: 0 0 160px;
  }
  & > div:last-child {
    flex: 1 0 auto;
  }
`;

const TableCell = ({ title, children }) => {
  return (
    <Wrapper>
      <div>{title}</div>
      <div>{children}</div>
    </Wrapper>
  );
};

export default TableCell;

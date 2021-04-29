import React from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  & > div:first-child {
    font-family: "Inter";
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 24px;
    color: rgba(0, 0, 0, 0.65);
    width: 440px;
    flex: 0 1 auto;
  }
  & > div:last-child {
    flex: 1;
  }
  @media screen and (max-width: 1140px) {
    flex-direction: column;
    align-items: stretch;
    & > div:first-child {
      width: 100%;
    }
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

import React from "react";
import styled from "styled-components";
import { ReactComponent as EmptySVG } from "./empty.svg";

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  p {
    font-size: 14px;
    line-height: 20px;
    color: var(--textSecondary);
    margin: 8px 0 0;
    text-align: center;
  }
  img {
    width: 300px;
    height: auto;
  }
`;

const NoComment = ({ type }) => {
  return (
    <Wrapper>
      <EmptySVG />
      <p>Join the discussion on SubSquare</p>
    </Wrapper>
  );
};

export default NoComment;

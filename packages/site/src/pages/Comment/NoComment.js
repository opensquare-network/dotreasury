import React from "react";
import styled from "styled-components";
import { Image } from "semantic-ui-react";

const Wrapper = styled.div`
  width: 100%;
  min-height: 456px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  p {
    color: rgba(29, 37, 60, 0.24);
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
      <Image src={"/imgs/empty.svg"} />
      <p>How do you think about this {type}?</p>
      <p>Leave your comments!</p>
    </Wrapper>
  );
};

export default NoComment;

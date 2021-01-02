import React from "react";
import styled from "styled-components";
import { Image } from "semantic-ui-react";

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  div p {
    color: rgba(29, 37, 60, 0.24);
    margin-top: 8px;
    text-align: center;
  }
`;

const NoComment = () => {
  return (
    <Wrapper>
      <div>
        <Image src={"/imgs/comment.png"} />
        <p>Comment will be supported soon.</p>
      </div>
    </Wrapper>
  );
};

export default NoComment;

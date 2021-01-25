import React from "react";
import styled from "styled-components";

import CommentItem from "./CommentItem";

const Wrapper = styled.div`
  div:first-child {
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
  }
`

const CommentList = ({ comments }) => {
  if (comments && comments.length > 0) {
    return (
      <Wrapper>
        { comments.map((item, index) => <CommentItem comment={item} index={index} key={index} />) }
      </Wrapper>
    )
  } else {
    return null;
  }

}

export default CommentList;

import React from "react";
import styled from "styled-components";

import CommentItem from "./CommentItem";

const Wrapper = styled.div`
  border-top: 1px solid #EEEEEE;
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

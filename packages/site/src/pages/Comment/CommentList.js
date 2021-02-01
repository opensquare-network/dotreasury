import React from "react";
import styled from "styled-components";

import CommentItem from "./CommentItem";

const Wrapper = styled.div`
  div:first-child {
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
  }
`;

const CommentList = ({ type, index, comments, refCommentId, onReplyButton }) => {
  if (comments && comments.length > 0) {
    return (
      <Wrapper>
        {comments.map((item, position) => (
          <CommentItem
            type={type}
            index={index}
            comment={item}
            position={position}
            key={position}
            refCommentId={refCommentId}
            onReplyButton={onReplyButton}
          />
        ))}
      </Wrapper>
    );
  } else {
    return null;
  }
};

export default CommentList;

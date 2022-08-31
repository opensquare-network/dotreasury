import React, {memo} from "react";
import styled from "styled-components";

import CommentItem from "./CommentItem";

const Wrapper = styled.div`
  div:first-child {
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
  }
`;
const CommentList = memo(({ comments }) => {
  if (comments?.items.length > 0) {
    const startFrom = comments.page * comments.pageSize;
    return (
      <Wrapper>
        {comments?.items.map((item, index) => (
          <CommentItem
            comment={item}
            index={startFrom + index}
            key={index}
          />
        ))}
      </Wrapper>
    );
  } else {
    return null;
  }
});

export default CommentList;

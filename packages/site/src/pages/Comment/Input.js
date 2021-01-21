import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { Button } from "semantic-ui-react";

import MarkdownEditor from "../../components/MarkdownEditor";

import {
  postComment,
} from "../../store/reducers/commentSlice";
import {
  loggedInUserSelector
} from "../../store/reducers/userSlice";

const Wrapper = styled.div`
  margin-top: 12px;
  display: flex;
  justify-content: flex-end;
`;

const Input = ({ type, index }) => {
  const [content, setContent] = useState("");
  const dispatch = useDispatch();
  const loggedInUser = useSelector(loggedInUserSelector);

  const post = () => {
    dispatch(postComment(type, index, content, loggedInUser));
  };

  return (
    <>
      <MarkdownEditor md={content} onChange={setContent} />
      <Wrapper>
        <Button primary disabled={!loggedInUser} onClick={post}>Confirm</Button>
      </Wrapper>
    </>
  );
};

export default Input;

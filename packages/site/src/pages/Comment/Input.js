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
  padding: 32px;
  border-top: 1px solid #EEEEEE;
`

const ButtonWrapper = styled.div`
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
    <Wrapper>
      <MarkdownEditor md={content} onChange={setContent} />
      <ButtonWrapper>
        <Button primary disabled={!loggedInUser} onClick={post}>Confirm</Button>
      </ButtonWrapper>
    </Wrapper>
  );
};

export default Input;

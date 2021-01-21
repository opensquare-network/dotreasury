import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { Button } from "semantic-ui-react";

import MarkdownEditor from "../../components/MarkdownEditor";

import {
  postComment,
} from "../../store/reducers/commentSlice";
import {
  isLoggedInSelector,
  accessTokenSelector,
} from "../../store/reducers/userSlice";

const Wrapper = styled.div`
  margin-top: 12px;
  display: flex;
  justify-content: flex-end;
`;

const Input = ({ type, index }) => {
  const [content, setContent] = useState("");
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(isLoggedInSelector);
  const accessToken = useSelector(accessTokenSelector);

  const post = () => {
    dispatch(postComment(type, index, content, accessToken));
  };

  return (
    <>
      <MarkdownEditor md={content} onChange={setContent} />
      <Wrapper>
        <Button primary disabled={!isLoggedIn} onClick={post}>Confirm</Button>
      </Wrapper>
    </>
  );
};

export default Input;

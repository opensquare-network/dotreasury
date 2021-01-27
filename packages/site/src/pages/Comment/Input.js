import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled, { css } from "styled-components";

import MarkdownEditor from "../../components/MarkdownEditor";
import Markdown from "../../components/Markdown";
import Button from "../../components/Button";
import ButtonPrimary from "../../components/ButtonPrimary";
import {
  postComment,
} from "../../store/reducers/commentSlice";
import {
  loggedInUserSelector
} from "../../store/reducers/userSlice";
import { PRIMARY_THEME_COLOR } from "../../constants";

const Wrapper = styled.div`
  padding: 32px;
  :not(:first-child) {
    border-top: 1px solid #EEEEEE;
  }
`

const MarkdownWrapper = styled.div`
  padding: 12px 20px;
  background: #FBFBFB;
  border-radius: 8px;
`

const ButtonWrapper = styled.div`
  margin-top: 12px;
  display: flex;
  justify-content: flex-end;
  & > :not(:last-child) {
    margin-right: 12px !important;
  }
`;

const PreviewButton = styled(Button)`
  ${p => p.active && css`
    color: ${PRIMARY_THEME_COLOR} !important;
    border-color: ${PRIMARY_THEME_COLOR} !important;
  `}
`

const Input = ({ type, index, authors }) => {
  const [content, setContent] = useState("");
  const [isPreview, setIsPreview] = useState(false);
  const dispatch = useDispatch();
  const loggedInUser = useSelector(loggedInUserSelector);

  const post = () => {
    dispatch(postComment(type, index, content));
  };

  return (
    <Wrapper>
      {!isPreview && <MarkdownEditor md={content} onChange={setContent} authors={authors} />}
      {isPreview && <MarkdownWrapper>
        <Markdown md={content || "Nothing to preview"} />
      </MarkdownWrapper>}
      <ButtonWrapper>
        <PreviewButton active={isPreview} onClick={() => setIsPreview(!isPreview)} >Preview</PreviewButton>
        <ButtonPrimary disabled={!loggedInUser} onClick={post}>Confirm</ButtonPrimary>
      </ButtonWrapper>
    </Wrapper>
  );
};

export default Input;

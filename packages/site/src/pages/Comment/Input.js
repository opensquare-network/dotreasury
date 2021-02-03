import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled, { css } from "styled-components";

import MarkdownEditor from "../../components/MarkdownEditor";
import Markdown from "../../components/Markdown";
import Button from "../../components/Button";
import ButtonPrimary from "../../components/ButtonPrimary";
import {
  postComment,
  clearCommentSelector,
  setClearComment,
} from "../../store/reducers/commentSlice";
import { loggedInUserSelector } from "../../store/reducers/userSlice";
import { PRIMARY_THEME_COLOR } from "../../constants";

const Wrapper = styled.div`
  padding: 32px;
  :not(:first-child) {
    border-top: 1px solid #eeeeee;
  }
`;

const MarkdownWrapper = styled.div`
  padding: 12px 20px;
  background: #fbfbfb;
  border-radius: 8px;
  min-height: 245px;
`;

const ButtonWrapper = styled.div`
  margin-top: 12px;
  display: flex;
  justify-content: flex-end;
  & > :not(:last-child) {
    margin-right: 12px !important;
  }
`;

const PreviewButton = styled(Button)`
  ${(p) =>
    p.active &&
    css`
      color: ${PRIMARY_THEME_COLOR} !important;
      border-color: ${PRIMARY_THEME_COLOR} !important;
      &.ui.button:focus {
        border-color: ${PRIMARY_THEME_COLOR} !important;
      }
    `}
`;

const Input = React.forwardRef(({ type, index, authors, content, setContent }, ref) => {
  const [isPreview, setIsPreview] = useState(false);
  const dispatch = useDispatch();
  const loggedInUser = useSelector(loggedInUserSelector);
  const clearComment = useSelector(clearCommentSelector);

  const post = () => {
    dispatch(postComment(type, index, content));
  };

  useEffect(() => {
    if (clearComment) {
      setContent("");
      dispatch(setClearComment(false));
    }
  }, [clearComment, dispatch, setContent]);

  return (
    <Wrapper ref={ref}>
      {!isPreview && (
        <MarkdownEditor md={content} onChange={setContent} authors={authors} />
      )}
      {isPreview && (
        <MarkdownWrapper>
          <Markdown md={content || ""} />
        </MarkdownWrapper>
      )}
      <ButtonWrapper>
        <PreviewButton
          active={isPreview}
          onClick={() => setIsPreview(!isPreview)}
        >
          Preview
        </PreviewButton>
        <ButtonPrimary disabled={!loggedInUser} onClick={post}>
          Comment
        </ButtonPrimary>
      </ButtonWrapper>
    </Wrapper>
  );
});

export default Input;

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled, { css } from "styled-components";
import { useHistory, useLocation } from "react-router";

import MarkdownEditor from "../../components/MarkdownEditor";
import Markdown from "../../components/Markdown";
import Button from "../../components/Button";
import ButtonPrimary from "../../components/ButtonPrimary";
import { useQuery } from "../../utils/hooks";
import {
  postComment,
  clearCommentSelector,
  setClearComment,
  setLastUpdateCommentTime,
} from "../../store/reducers/commentSlice";
import {
  loggedInUserSelector,
  fetchUserProfile,
  userProfileSelector,
} from "../../store/reducers/userSlice";
import { chainSelector } from "../../store/reducers/chainSlice";

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

const ButtonSecondary = styled(Button)`
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

const Input = React.forwardRef(
  ({ type, index, authors, content, setContent, pageSize }, ref) => {
    const history = useHistory();
    const location = useLocation();
    const [isPreview, setIsPreview] = useState(false);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const loggedInUser = useSelector(loggedInUserSelector);
    const userProfile = useSelector(userProfileSelector);
    const clearComment = useSelector(clearCommentSelector);
    const chain = useSelector(chainSelector);

    useEffect(() => {
      if (loggedInUser) {
        dispatch(fetchUserProfile());
      }
    }, [dispatch, loggedInUser]);

    const page = useQuery().get("page");
    const post = async () => {
      setLoading(true);
      try {
        await dispatch(postComment(chain, type, index, content));
        if (page === "last") {
          dispatch(setLastUpdateCommentTime(Date.now()));
        } else {
          history.push({
            search: `?page=last`,
          });
        }
      } finally {
        setLoading(false);
        isPreview && setIsPreview(false);
      }
    };

    useEffect(() => {
      if (clearComment) {
        setContent("");
        dispatch(setClearComment(false));
      }
    }, [clearComment, dispatch, setContent]);

    const { emailVerified } = userProfile ?? {};

    return (
      <Wrapper ref={ref}>
        {loggedInUser &&
          emailVerified &&
          (isPreview ? (
            <MarkdownWrapper>
              <Markdown md={content || ""} />
            </MarkdownWrapper>
          ) : (
            <MarkdownEditor
              md={content}
              onChange={setContent}
              authors={authors}
            />
          ))}
        {loggedInUser ? (
          emailVerified ? (
            <ButtonWrapper>
              <ButtonSecondary
                active={isPreview}
                onClick={() => setIsPreview(!isPreview)}
              >
                Preview
              </ButtonSecondary>
              <ButtonPrimary
                disabled={loading}
                loading={loading}
                onClick={post}
              >
                Comment
              </ButtonPrimary>
            </ButtonWrapper>
          ) : (
            <ButtonWrapper>
              <ButtonPrimary
                onClick={() => {
                  history.push("/settings");
                }}
              >
                Verify email
              </ButtonPrimary>
            </ButtonWrapper>
          )
        ) : (
          <ButtonWrapper>
            <ButtonSecondary
              onClick={() => {
                history.push("/register");
              }}
            >
              Sign up
            </ButtonSecondary>
            <ButtonPrimary
              onClick={() => {
                history.push({
                  pathname: "/login",
                  search: "?returnUrl=" + encodeURIComponent(location.pathname),
                });
              }}
            >
              Login
            </ButtonPrimary>
          </ButtonWrapper>
        )}
      </Wrapper>
    );
  }
);

export default Input;

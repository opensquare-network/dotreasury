import React, { useState, useRef, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import useDeepCompareEffect from "use-deep-compare-effect";
import styled from "styled-components";

import Card from "../../components/Card";
import SubTitle from "../../components/SubTitle";
import Input from "./Input";
import CommentList from "./CommentList";
import { unique } from "../../utils/index";
import {
  fetchComments,
  commentsSelector,
  lastNewPostSelector,
  setLastNewPost,
  lastUpdateCommentTimeSelector,
} from "../../store/reducers/commentSlice";
import ResponsivePagination from "../../components/ResponsivePagination";
import { useQuery } from "../../utils/hooks";

import { useLocation } from "react-router-dom";
import { useHistory } from "react-router";
import NoComment from "./NoComment";

const Header = styled(SubTitle)`
  margin-bottom: 16px;
`;

const Wrapper = styled(Card)`
  padding: 0;
`;

const DEFAULT_PAGE_SIZE = 20;
const DEFAULT_QUERY_PAGE = 1;

const Comment = ({ type, index }) => {
  const commentRef = useRef(null);
  const inputRef = useRef(null);
  const history = useHistory();
  const dispatch = useDispatch();
  const [refreshComment, setRefreshComment] = useState(0);

  const { hash } = useLocation();
  const hashCommentId = hash && hash.slice(1);
  const [refCommentId, setRefCommentId] = useState(hashCommentId);

  let searchPage = useQuery().get("page");
  if (searchPage !== "last") {
    searchPage = parseInt(searchPage);
  }

  const tablePage =
    searchPage === "last"
      ? searchPage
      : searchPage && !isNaN(searchPage) && searchPage > 0
      ? searchPage
      : DEFAULT_QUERY_PAGE;

  const comments = useSelector(commentsSelector);
  const lastNewPost = useSelector(lastNewPostSelector);
  const lastUpdateCommentTime = useSelector(lastUpdateCommentTimeSelector);

  const totalPages = Math.ceil(comments.total / DEFAULT_PAGE_SIZE);

  const [content, setContent] = useState("");

  useDeepCompareEffect(() => {
    dispatch(
      fetchComments(
        type,
        index,
        tablePage === "last" ? tablePage : tablePage - 1,
        DEFAULT_PAGE_SIZE
      )
    );
  }, [dispatch, type, index, tablePage, lastUpdateCommentTime, refreshComment]);

  useDeepCompareEffect(() => {
    if (lastNewPost) {
      dispatch(setLastNewPost(null));
      if (searchPage !== "last") {
        history.push({
          search: `?page=last`,
        });
        setRefCommentId(lastNewPost);
      } else {
        setRefreshComment(refreshComment + 1);
      }
    }
  }, [dispatch, lastNewPost]);

  // If the actual page index is changed, and there is a page query in url
  // then we always scroll the comments to view.
  const actualPage = comments.page;
  useEffect(() => {
    if (searchPage && !hashCommentId) {
      commentRef.current.scrollIntoView();
    }
  }, [searchPage, actualPage, hashCommentId]);

  const setReplyToCallback = useCallback((reply) => {
    setContent(reply);
    inputRef.current.scrollIntoView();
    inputRef.current.querySelector("textarea").focus();
  }, [inputRef]);

  const authors = unique(
    (comments?.items || [])
      .map((item) => item.author?.username)
      .filter((v) => !!v)
  );

  const replyEvent = (user) => {
    setReplyToCallback(`[@${user}](https://dotreasury.com/user/${user}) `);
  }

  return (
    <div>
      <Header ref={commentRef}>Comment</Header>
      <Wrapper>
        {(!comments || comments.items?.length === 0) && <NoComment />}
        {comments && comments.items?.length > 0 && <div>
          <CommentList
            comments={comments}
            refCommentId={refCommentId}
            onReplyButton={setReplyToCallback}
            replyEvent={replyEvent}
          />
          <ResponsivePagination
            activePage={comments.page + 1}
            totalPages={totalPages}
            onPageChange={(_, { activePage }) => {
              history.push({
                search: `?page=${activePage}`,
              });
            }}
          />
        </div>}
        <Input
          type={type}
          index={index}
          authors={authors}
          content={content}
          setContent={setContent}
          ref={inputRef}
        />
      </Wrapper>
    </div>
  );
};

export default Comment;

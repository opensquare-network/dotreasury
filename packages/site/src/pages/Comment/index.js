import React, { useState, useRef, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { Dimmer, Image } from "semantic-ui-react";
import useDeepCompareEffect from "use-deep-compare-effect";

import Card from "../../components/Card";
import Input from "./Input";
import CommentList from "./CommentList";
import { unique } from "../../utils/index";
import {
  fetchComments,
  commentsSelector,
  setComments,
  setLastNewPost,
  lastUpdateCommentTimeSelector,
} from "../../store/reducers/commentSlice";
import { chainSelector } from "../../store/reducers/chainSlice";
import ResponsivePagination from "./ResponsivePagination";
import { useQuery } from "../../utils/hooks";

import { useLocation } from "react-router-dom";
import { useHistory } from "react-router";
import NoComment from "./NoComment";

const Header = styled.div`
  padding: 20px 24px;
  font-size: 16px;
  line-height: 24px;
  color: rgba(0, 0, 0, 0.9);
  font-weight: bold;
`;

const Wrapper = styled(Card)`
  padding: 0;
  position: relative;
`;

const DEFAULT_PAGE_SIZE = 20;
const DEFAULT_QUERY_PAGE = 1;

const Comment = ({ type, index }) => {
  const commentRef = useRef(null);
  const inputRef = useRef(null);
  const history = useHistory();
  const dispatch = useDispatch();
  const { hash } = useLocation();

  // from email notification when mentioned on comments
  const hashCommentId = hash && hash.slice(1);
  useEffect(() => {
    dispatch(setLastNewPost(hashCommentId));
  }, [dispatch, hashCommentId]);

  const [content, setContent] = useState("");
  const [loadingList, setLoadingList] = useState(false);

  let searchPage = useQuery().get("page");
  if (searchPage !== "last") {
    searchPage = parseInt(searchPage);
  }

  let tablePage =
    searchPage === "last"
      ? searchPage
      : searchPage && !isNaN(searchPage) && searchPage > 0
      ? searchPage
      : DEFAULT_QUERY_PAGE;
  const comments = useSelector(commentsSelector);
  const lastUpdateCommentTime = useSelector(lastUpdateCommentTimeSelector);
  const chain = useSelector(chainSelector);

  const totalPages = Math.ceil(comments.total / DEFAULT_PAGE_SIZE);

  useDeepCompareEffect(() => {
    (async () => {
      if (!index) return;

      setLoadingList(true);
      try {
        await dispatch(
          fetchComments(
            chain,
            type,
            index,
            tablePage === "last" ? tablePage : tablePage - 1,
            DEFAULT_PAGE_SIZE
          )
        );
      } finally {
        setLoadingList(false);
      }
    })();
    return () => {
      dispatch(setComments([]));
    };
  }, [dispatch, chain, type, index, tablePage, lastUpdateCommentTime]);

  // If the actual page index is changed, and there is a page query in url
  // then we always scroll the comments to view.
  const actualPage = comments.page;
  useEffect(() => {
    if (searchPage && !hashCommentId) {
      commentRef.current.scrollIntoView();
    }
  }, [searchPage, actualPage, hashCommentId]);

  const setReplyToCallback = useCallback(
    (reply) => {
      setContent(reply);
      inputRef.current.scrollIntoView();
      inputRef.current.querySelector("textarea")?.focus();
    },
    [inputRef]
  );

  const authors = unique(
    (comments?.items || [])
      .map((item) => item.author?.username)
      .filter((v) => !!v)
  );

  const replyEvent = useCallback(
    (user) => {
      setReplyToCallback(`[@${user}](https://dotreasury.com/user/${user}) `);
    },
    [setReplyToCallback]
  );

  const pageChange = useCallback(
    (_, { activePage }) => {
      history.push({
        search: `?page=${activePage}`,
      });
    },
    [history]
  );

  return (
    <div>
      <Wrapper>
        <Header ref={commentRef}>Comment</Header>
        <Dimmer active={loadingList} inverted>
          <Image src="/imgs/loading.svg" />
        </Dimmer>
        {(!comments || comments.items?.length === 0) && (
          <NoComment type={type} />
        )}
        {comments && comments.items?.length > 0 && (
          <div>
            <CommentList
              comments={comments}
              onReplyButton={setReplyToCallback}
              replyEvent={replyEvent}
            />
            <ResponsivePagination
              activePage={comments.page + 1}
              totalPages={totalPages}
              onPageChange={pageChange}
            />
          </div>
        )}
        <Input
          type={type}
          index={index}
          authors={authors}
          content={content}
          setContent={setContent}
          pageSize={DEFAULT_PAGE_SIZE}
          ref={inputRef}
        />
      </Wrapper>
    </div>
  );
};

export default Comment;

import React, { useState, useRef, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { Dimmer, Image } from "semantic-ui-react";
import useDeepCompareEffect from "use-deep-compare-effect";
import isNil from "lodash.isnil";

import Card from "../../components/Card";
import CommentList from "./CommentList";
import {
  fetchComments,
  commentsSelector,
  setComments,
  setLastNewPost,
  lastUpdateCommentTimeSelector,
} from "../../store/reducers/commentSlice";
import ResponsivePagination from "./ResponsivePagination";
import { useQuery } from "../../utils/hooks";

import { useLocation } from "react-router-dom";
import { useHistory } from "react-router";
import NoComment from "./NoComment";
import { DEFAULT_PAGE_SIZE, DEFAULT_QUERY_PAGE } from "../../constants";
import SubSquare from "./SubSquare";
import { useDark } from "../../context/theme";

const Header = styled.div`
  padding: 20px 24px;
  font-size: 16px;
  line-height: 24px;
  color: var(--textPrimary);
  font-weight: bold;
`;

const Wrapper = styled(Card)`
  padding: 0;
  position: relative;
`;

const Comment = ({ type, index }) => {
  const commentRef = useRef(null);
  const history = useHistory();
  const dispatch = useDispatch();
  const { hash } = useLocation();
  const dark = useDark();

  // from email notification when mentioned on comments
  const hashCommentId = hash && hash.slice(1);
  useEffect(() => {
    dispatch(setLastNewPost(hashCommentId));
  }, [dispatch, hashCommentId]);

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

  const totalPages = Math.ceil(comments.total / DEFAULT_PAGE_SIZE);

  useDeepCompareEffect(() => {
    (async () => {
      if (isNil(index)) {
        return;
      }

      setLoadingList(true);
      try {
        await dispatch(
          fetchComments(
            type,
            index,
            tablePage === "last" ? tablePage : tablePage - 1,
            DEFAULT_PAGE_SIZE,
          ),
        );
      } finally {
        setLoadingList(false);
      }
    })();
    return () => {
      dispatch(setComments([]));
    };
  }, [dispatch, type, index, tablePage, lastUpdateCommentTime]);

  // If the actual page index is changed, and there is a page query in url
  // then we always scroll the comments to view.
  const actualPage = comments.page;
  useEffect(() => {
    if (searchPage && !hashCommentId) {
      commentRef.current.scrollIntoView();
    }
  }, [searchPage, actualPage, hashCommentId]);

  const pageChange = useCallback(
    (_, { activePage }) => {
      history.push({
        search: `?page=${activePage}`,
      });
    },
    [history],
  );

  if (type === "project" && (comments?.items?.length || []) <= 0) {
    return null;
  }

  return (
    <div>
      <Wrapper>
        <Header ref={commentRef}>Comment</Header>
        <Dimmer active={loadingList} inverted={dark ? false : true}>
          <Image src="/imgs/loading.svg" />
        </Dimmer>
        {(!comments || comments.items?.length === 0) && (
          <NoComment type={type} />
        )}
        {comments && comments.items?.length > 0 && (
          <div>
            <CommentList comments={comments} />
            <ResponsivePagination
              activePage={comments.page + 1}
              totalPages={totalPages}
              onPageChange={pageChange}
            />
          </div>
        )}
        <SubSquare type={type} index={index} />
      </Wrapper>
    </div>
  );
};

export default Comment;

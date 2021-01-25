import React from "react";
import { useDispatch, useSelector } from "react-redux";
import useDeepCompareEffect from 'use-deep-compare-effect'
import styled from "styled-components";

import Card from "../../components/Card";
import SubTitle from "../../components/SubTitle";
import Input from "./Input";
import CommentList from "./CommentList";

import {
  fetchComments,
  commentsSelector,
} from "../../store/reducers/commentSlice";

const Header = styled(SubTitle)`
  margin-bottom: 16px;
`;

const Wrapper = styled(Card)`
  padding: 0;
`;

const Comment = ({ type, index }) => {
  const dispatch = useDispatch()

  useDeepCompareEffect(() => {
    dispatch(fetchComments(type, index));
  }, [dispatch, type, index]);

  const comments = useSelector(commentsSelector);

  return (
    <div>
      <Header>Comment</Header>
      <Wrapper>
        <CommentList comments={comments.comments} />
        <Input type={type} index={index} />
      </Wrapper>
    </div>
  );
};

export default Comment;

import React from "react";
import { useDispatch, useSelector } from "react-redux";
import useDeepCompareEffect from 'use-deep-compare-effect'
import styled from "styled-components";
import { Divider } from "semantic-ui-react";

import Card from "../../components/Card";
import SubTitle from "../../components/SubTitle";
import CommentArea from "./CommentArea";
import NoComment from "./NoComment";
import Input from "./Input";

import {
  fetchComments,
  commentsSelector,
} from "../../store/reducers/commentSlice";

const Header = styled(SubTitle)`
  margin-bottom: 16px;
`;

const Body = styled(Card)`
  padding: 20px;
`;

const Comment = ({ type, index }) => {
  const dispatch = useDispatch()

  useDeepCompareEffect(() => {
    dispatch(fetchComments(type, index));
  }, [dispatch, type, index]);

  const comments = useSelector(commentsSelector);
  console.log(comments);

  return (
    <div>
      <Header>Comment</Header>
      <Body>
        <CommentArea>
          <NoComment />
        </CommentArea>
        <Divider />
        <Input type={type} index={index} />
      </Body>
    </div>
  );
};

export default Comment;

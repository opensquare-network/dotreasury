import React from "react";
import styled from "styled-components";
import { Divider } from "semantic-ui-react";

import Card from "../../components/Card";
import SubTitle from "../../components/SubTitle";
import CommentArea from "./CommentArea";
import NoComment from "./NoComment";
import Input from "./Input";

const Header = styled(SubTitle)`
  margin-bottom: 16px;
`;

const Body = styled(Card)`
  padding: 20px;
`;

const Comment = () => {
  return (
    <div>
      <Header>Comment</Header>
      <Body>
        <CommentArea>
          <NoComment />
        </CommentArea>
        <Divider />
        <Input />
      </Body>
    </div>
  );
};

export default Comment;

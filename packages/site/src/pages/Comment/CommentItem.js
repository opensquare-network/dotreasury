import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled, { css } from "styled-components";
import { Image } from "semantic-ui-react";
import dayjs from "dayjs";

import Text from "../../components/Text";
import TextMinor from "../../components/TextMinor";
import TextDisable from "../../components/TextDisable";
import Markdown from "../../components/Markdown";
import { PRIMARY_THEME_COLOR, SECONDARY_THEME_COLOR } from "../../constants";
import { useIsMounted } from "../../utils/hooks";

import {
  setCommentThumbUp,
  setCommentThumbDown,
} from "../../store/reducers/commentSlice";
import { isLoggedInSelector } from "../../store/reducers/userSlice";

const Wrapper = styled.div`
  padding: 32px 32px 16px;
  :hover {
    background: #fbfbfb;
  }
  ${p => p.highLight && css`
    background: #fbfbfb;
  `}
`;

const HeaderWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
`;

const Avatar = styled(Image)`
  margin-right: 8px;
`;

const Username = styled(TextMinor)`
  margin-right: 16px;
`;

const Index = styled(TextMinor)`
  background: #fbfbfb;
  border-radius: 10px;
  height: 20px;
  padding: 0 8px;
  line-height: 20px;
  margin-left: auto;
  font-size: 12px;
`;

const TopLabel = styled(Text)`
  background: ${SECONDARY_THEME_COLOR};
  color: ${PRIMARY_THEME_COLOR};
  line-height: 20px;
  font-size: 12px;
  padding: 0 8px;
  border-radius: 10px;
  margin-left: 8px;
`;

const ContnetWrapper = styled.div`
  margin-left: 32px;
`;

const ButtonList = styled.div`
  display: flex;
  align-items: center;
`;

const Button = styled.div`
  cursor: pointer;
  opacity: 0.24;
  :not(:last-child) {
    margin-right: 8px;
  }
  :hover {
    opacity: 0.64;
  }
`;

const ReplayButton = styled(Button)`
  display: flex;
  align-items: center;
  margin-right: 16px !important;
  & > :first-child {
    margin-right: 5px;
  }
`;

const CommentItem = ({ type, index, comment, position, refCommentId }) => {
  const [highLight, setHighLight] = useState(false);
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(isLoggedInSelector);
  const commentRef = useRef(null);
  const isMounted = useIsMounted();

  const commentId = comment.commentId;
  const thumbUp = () => {
    dispatch(setCommentThumbUp(type, index, commentId));
  };

  const thumbDown = () => {
    dispatch(setCommentThumbDown(type, index, commentId));
  };
  const isTop = false;
  useEffect(() => {
    setTimeout(() => {
      if (isMounted.current && (commentId === refCommentId)) {
        commentRef.current.scrollIntoView();
        setHighLight(true);
      }
    }, 1000);
    setTimeout(() => {
      if (isMounted.current) {
        setHighLight(false);
      }
    }, 4000);
  }, [commentId, refCommentId, isMounted]);

  return (
    <Wrapper id={comment.commentId} ref={commentRef} highLight={highLight}>
      <HeaderWrapper>
        <Avatar src="/imgs/avatar.png" />
        <Username>{comment.author.username}</Username>
        <TextDisable>
          {dayjs(comment.createdAt).format("YYYY-MM-DD HH:mm:ss")}
        </TextDisable>
        <Index>#{position + 1}</Index>
        {isTop && <TopLabel>top</TopLabel>}
      </HeaderWrapper>
      <ContnetWrapper>
        <Markdown md={comment.content} />
        <ButtonList>
          <ReplayButton>
            <Image src="/imgs/reply.svg" />
            <Text>Reply</Text>
          </ReplayButton>
          <Button onClick={thumbUp} disabled={isLoggedIn}>
            <Image src="/imgs/thumb-up.svg" />
          </Button>
          <Button onClick={thumbDown} disabled={isLoggedIn}>
            <Image src="/imgs/thumb-down.svg" />
          </Button>
        </ButtonList>
      </ContnetWrapper>
    </Wrapper>
  );
};

export default CommentItem;

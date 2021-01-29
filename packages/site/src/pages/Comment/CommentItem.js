import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled, { css } from "styled-components";
import { Image } from "semantic-ui-react";
import dayjs from "dayjs";

import Text from "../../components/Text";
import TextMinor from "../../components/TextMinor";
import TextDisable from "../../components/TextDisable";
import Markdown from "../../components/Markdown";
import {
  PRIMARY_THEME_COLOR,
  SECONDARY_THEME_COLOR,
  REACTION_THUMBUP,
} from "../../constants";
import { useIsMounted } from "../../utils/hooks";

import {
  setCommentThumbUp,
  unsetCommentReaction,
} from "../../store/reducers/commentSlice";
import {
  isLoggedInSelector,
  loggedInUserSelector,
} from "../../store/reducers/userSlice";

const Wrapper = styled.div`
  padding: 32px 32px 16px;
  :hover {
    background: #fbfbfb;
  }
  ${(p) =>
    p.highLight &&
    css`
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
  :not(:last-child) {
    margin-right: 8px;
  }
`;

const ReplayButton = styled(Button)`
  display: flex;
  opacity: 0.24;
  :hover {
    opacity: 0.64;
  }
  align-items: center;
  margin-right: 16px !important;
  & > :first-child {
    margin-right: 5px;
  }
`;

const VoteWrapper = styled.div`
  display: flex;
  align-items: center;
  & > :first-child {
    margin-right: 4px;
  }
  ${(p) =>
    p.noHover
      ? undefined
      : css`
          &:hover {
            opacity: 0.64;
          }
        `}
  ${(p) =>
    p.highlight
      ? css`
          opacity: 1;
        `
      : css`
          opacity: 0.24;
        `}
`;

const VoteButton = styled(Button)`
  display: flex;
  align-items: center;
  & > :first-child {
    margin-right: 5px;
  }
`;

const VoteText = styled(Text)`
  ${(p) =>
    p.highlight
      ? css`
          color: rgba(223, 64, 93);
        `
      : css`
          color: rgba(29, 37, 60);
        `}
`;

const CommentItem = ({ type, index, comment, position, refCommentId }) => {
  const [highLight, setHighLight] = useState(false);
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(isLoggedInSelector);
  const commentRef = useRef(null);
  const isMounted = useIsMounted();
  const loggedInUser = useSelector(loggedInUserSelector);

  const upCount =
    comment.reactions?.filter((r) => r.reaction === REACTION_THUMBUP).length ||
    0;
  const highlight = comment.reactions?.some(
    (r) => r.user.username === loggedInUser?.username
  );
  const ownComment = comment.author.username === loggedInUser?.username;

  const commentId = comment.commentId;
  const thumbUp = () => {
    if (isLoggedIn) {
      if (highlight) {
        dispatch(unsetCommentReaction(type, index, commentId));
      } else {
        dispatch(setCommentThumbUp(type, index, commentId));
      }
    }
  };

  const isTop = false;
  useEffect(() => {
    setTimeout(() => {
      if (isMounted.current && commentId === refCommentId) {
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
          <VoteWrapper highlight={highlight} noHover={ownComment}>
            <VoteButton onClick={thumbUp}>
              <Image
                src={
                  highlight
                    ? "/imgs/thumb-up-highlight.svg"
                    : "/imgs/thumb-up.svg"
                }
              />
              <VoteText highlight={highlight}>Up</VoteText>
            </VoteButton>
            <VoteText highlight={highlight}>({upCount})</VoteText>
          </VoteWrapper>
        </ButtonList>
      </ContnetWrapper>
    </Wrapper>
  );
};

export default CommentItem;

import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled, { css } from "styled-components";
import { Image, Loader } from "semantic-ui-react";
import dayjs from "dayjs";
import copy from "copy-to-clipboard";

import Text from "../../components/Text";
import TextMinor from "../../components/TextMinor";
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
  setLastNewPost,
  lastNewPostSelector,
} from "../../store/reducers/commentSlice";
import {
  isLoggedInSelector,
  loggedInUserSelector,
} from "../../store/reducers/userSlice";
import TimeElapsed from "../../components/TimeElapsed";
import { TEXT_DARK_DISABLE } from "../../constants";
import { chainSelector } from "../../store/reducers/chainSlice";
import User from "../../components/User";

const Wrapper = styled.div`
  padding: 32px 32px 16px;
  :hover {
    background: #fbfbfb;
  }
  ${(p) =>
    p.highLight &&
    css`
      background: #fff9fa;
    `}
`;

const HeaderWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  & > :first-child {
    margin-right: 8px;
  }
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

const OperateWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;
const Copy = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  color: rgba(29, 37, 60);
  opacity: 0.24;
  ${(p) =>
    p.active &&
    css`
      opacity: 0.64;
    `}
  :hover {
    opacity: 0.64;
  }
  img {
    margin-right: 6px;
  }
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
    ${(p) =>
      p.noHover &&
      css`
        opacity: 0.24;
        cursor: auto;
      `}
  }
  align-items: center;
  margin-right: 16px !important;
  & > :first-child {
    margin-right: 5px;
  }
`;

const VoteWrapper = styled(Button)`
  display: flex;
  align-items: center;
  & > :first-child {
    margin-right: 4px;
  }
  ${(p) =>
    p.noHover
      ? css`
          & * {
            cursor: auto;
          }
        `
      : css`
          &:hover {
            opacity: ${(p) => (p.thumbup ? 1 : 0.64)};
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
    margin-right: 5px !important;
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

const FlexWrapper = styled.div`
  display: flex;
  align-items: center;
  & > :last-child {
    margin-left: 4px;
  }
`;

const TimeWrapper = styled.div`
  color: ${TEXT_DARK_DISABLE};
`;

const CircleImage = styled(Image)`
  width: 24px;
  height: 24px;
  border-radius: 50%;
`;

const Username = styled(TextMinor)`
  margin-right: 16px;
`;

const CommentItem = ({ index, comment, onReplyButton, replyEvent }) => {
  const upCountDefault =
    comment.reactions?.filter((r) => r.reaction === REACTION_THUMBUP)[0]
      ?.count || 0;

  const [highLight, setHighLight] = useState(false);
  const [thumbup, setThumbup] = useState(
    comment.myReaction === REACTION_THUMBUP
  );
  const [thumbupLoading, setThumbupLoading] = useState(false);
  const [upCount, setUpCount] = useState(upCountDefault);
  const [linkCopied, setLinkCopied] = useState(false);

  const dispatch = useDispatch();
  const isLoggedIn = useSelector(isLoggedInSelector);
  const commentRef = useRef(null);
  const isMounted = useIsMounted();
  const loggedInUser = useSelector(loggedInUserSelector);
  const lastNewPost = useSelector(lastNewPostSelector);
  const chain = useSelector(chainSelector);

  const address = comment.author?.addresses?.filter(
    (i) => i.chain === chain
  )[0];

  const ownComment = comment.author?.username === loggedInUser?.username;
  const commentId = comment._id;

  const thumbUpToogle = async () => {
    if (isLoggedIn && !ownComment && !thumbupLoading) {
      try {
        setThumbupLoading(true);
        if (thumbup) {
          const { result } = await dispatch(unsetCommentReaction(commentId));
          if (result) {
            setThumbup(false);
            setUpCount(upCount - 1);
          }
        } else {
          const { result } = await dispatch(setCommentThumbUp(commentId));
          if (result) {
            setThumbup(true);
            setUpCount(upCount + 1);
          }
        }
      } finally {
        setThumbupLoading(false);
      }
    }
  };

  const copyLink = () => {
    let copyContent = window.location.href;
    if (copyContent.includes("#")) {
      copyContent = copyContent.split("#")[0];
    }
    copyContent += "#" + commentId;
    copy(copyContent);
    setLinkCopied(true);
    setTimeout(() => {
      setLinkCopied(false);
    }, 500);
  };

  const isTop = false;
  useEffect(() => {
    if (isMounted.current && commentId === lastNewPost) {
      dispatch(setLastNewPost(null));
      setTimeout(() => {
        commentRef.current.scrollIntoView();
        setHighLight(true);
      }, 1000);
      setTimeout(() => {
        if (isMounted.current) {
          setHighLight(false);
        }
      }, 4000);
    }
  }, [dispatch, lastNewPost, commentId, isMounted]);

  return (
    <Wrapper id={comment._id} ref={commentRef} highLight={highLight}>
      <HeaderWrapper>
        {address?.address && <User address={address?.address} />}
        {!address?.address && (
          <>
            <CircleImage src={comment.author?.avatar ?? "/imgs/avatar.png"} />
            <Username>{comment.author?.username ?? "Deleted Account"}</Username>
          </>
        )}
        <TimeWrapper>
          {dayjs().diff(dayjs(comment.createdAt), "day") >= 1 ? (
            dayjs(comment.createdAt).format("YYYY-MM-DD")
          ) : (
            <FlexWrapper>
              <TimeElapsed from={dayjs(comment.createdAt).valueOf()} />
              <span>ago</span>
            </FlexWrapper>
          )}
        </TimeWrapper>
        <Index>#{index + 1}</Index>
        {isTop && <TopLabel>top</TopLabel>}
      </HeaderWrapper>
      <ContnetWrapper>
        <Markdown md={comment.content} replyEvent={replyEvent} />
        <OperateWrapper>
          <ButtonList>
            <ReplayButton
              onClick={() =>
                !ownComment &&
                isLoggedIn &&
                comment.author?.username &&
                onReplyButton(
                  `[@${comment.author?.username}](https://dotreasury.com/user/${comment.author?.username}) `
                )
              }
              noHover={ownComment || !isLoggedIn || !comment.author?.username}
            >
              <Image src="/imgs/reply.svg" />
              <Text>Reply</Text>
            </ReplayButton>
            <VoteWrapper
              highlight={thumbup}
              noHover={ownComment || !isLoggedIn || thumbupLoading}
            >
              <VoteButton onClick={thumbUpToogle}>
                {thumbupLoading ? (
                  <Loader size="mini" active inline></Loader>
                ) : (
                  <Image
                    src={
                      thumbup
                        ? "/imgs/thumb-up-highlight.svg"
                        : "/imgs/thumb-up.svg"
                    }
                  />
                )}
                <VoteText highlight={thumbup}>Up</VoteText>
                <VoteText highlight={thumbup}>({upCount})</VoteText>
              </VoteButton>
            </VoteWrapper>
          </ButtonList>
          <Copy active={linkCopied} onClick={copyLink}>
            <Image src="/imgs/copy.svg" />
            <Text>{linkCopied ? "Copied" : "Copy Link"}</Text>
          </Copy>
        </OperateWrapper>
      </ContnetWrapper>
    </Wrapper>
  );
};

export default CommentItem;

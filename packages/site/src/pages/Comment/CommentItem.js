import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled, { css } from "styled-components";
import { Image } from "semantic-ui-react";
import dayjs from "dayjs";
import Text from "../../components/Text";
import TextMinor from "../../components/TextMinor";
import Markdown from "../../components/Markdown";
import {
  PRIMARY_THEME_COLOR,
  SECONDARY_THEME_COLOR,
} from "../../constants";
import { useIsMounted } from "@osn/common";
import {
  setLastNewPost,
  lastNewPostSelector,
} from "../../store/reducers/commentSlice";
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
  background: #f4f4f4;
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

const CommentItem = ({ index, comment }) => {
  const [highLight, setHighLight] = useState(false);

  const dispatch = useDispatch();
  const commentRef = useRef(null);
  const isMounted = useIsMounted();
  const lastNewPost = useSelector(lastNewPostSelector);
  const chain = useSelector(chainSelector);

  const address = comment.author?.addresses?.filter(
    (i) => i.chain === chain
  )[0];

  const commentId = comment._id;

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
        <Markdown md={comment.content} />
      </ContnetWrapper>
    </Wrapper>
  );
};

export default CommentItem;

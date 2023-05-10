import styled, { css } from "styled-components";
import { Image, Loader } from "semantic-ui-react";
import { useDispatch, useSelector } from "react-redux";
import { loggedInUserSelector } from "../../store/reducers/userSlice";
import { REACTION_THUMBUP } from "../../constants";
import { useEffect, useState } from "react";
import { setRateThumbUp, unsetRateReaction } from "../../store/reducers/rateSlice";
import Text from "../Text";

const Button = styled.div`
  cursor: pointer;
  :not(:last-child) {
    margin-right: 8px;
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

export default function ThumbUp({ rate }) {
  const dispatch = useDispatch();
  const thumbupDefault = rate.myReaction === REACTION_THUMBUP;
  const [thumbup, setThumbup] = useState(thumbupDefault);
  const [thumbupLoading, setThumbupLoading] = useState(false);
  const loggedInUser = useSelector(loggedInUserSelector);
  const isLoggedIn = !!loggedInUser;
  const rateId = rate._id;
  const upCountDefault =
    rate.reactions?.filter((r) => r.reaction === REACTION_THUMBUP)[0]
      ?.count || 0;
  const [upCount, setUpCount] = useState(upCountDefault);

  useEffect(() => {
    setThumbup(thumbupDefault);
    setUpCount(upCountDefault);
  }, [thumbupDefault, upCountDefault]);

  const thumbUpToogle = async () => {
    if (isLoggedIn && !thumbupLoading) {
      try {
        setThumbupLoading(true);
        if (thumbup) {
          const { result } = await dispatch(unsetRateReaction(rateId));
          if (result) {
            setThumbup(false);
            setUpCount(upCount - 1);
          }
        } else {
          const { result } = await dispatch(setRateThumbUp(rateId));
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

  return (
    <VoteWrapper
      highlight={thumbup}
      noHover={!isLoggedIn || thumbupLoading}
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
  );
}

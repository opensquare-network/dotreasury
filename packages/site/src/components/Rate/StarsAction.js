import styled, { css } from "styled-components";

const Wrapper = styled.div`
  display: flex;
  cursor: pointer;
  > :not(:last-child) {
    width: 22px;
    padding-right: 6px;
  }
  :hover div {
    background-image: url("/imgs/star.svg");
  }
  > div:hover ~ div {
    background-image: url("/imgs/star-unfilled.svg");
  }
`;

const Star = styled.div`
  width: 16px;
  height: 16px;
  background-repeat: no-repeat;
  background-image: url("/imgs/star-unfilled.svg");
  ${(p) =>
    p.filled &&
    css`
      background-image: url("/imgs/star.svg");
    `}
`;

export default function StarsAction({ rate, setRate }) {
  return (
    <Wrapper>
      {[...Array(5).keys()].map((item) => (
        <Star
          key={item}
          filled={item <= rate - 1}
          onClick={() => setRate(item + 1)}
        />
      ))}
    </Wrapper>
  );
}

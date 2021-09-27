import styled, { css } from "styled-components";

const Wrapper = styled.div`
  display: flex;
  height: 24px;
  align-items: center;
  > :not(:first-child) {
    margin-left: 6px;
  }
`;

const Star = styled.div`
  width: 16px;
  height: 16px;
  background: url("/imgs/star-unfilled.svg");
  ${(p) =>
    p.filled &&
    css`
      background: url("/imgs/star.svg");
    `}
`;

export default function Stars({ rate = 0 }) {
  return (
    <Wrapper>
      {[...Array(5).keys()].map((item) => (
        <Star key={item} filled={item <= rate - 1} />
      ))}
    </Wrapper>
  );
}

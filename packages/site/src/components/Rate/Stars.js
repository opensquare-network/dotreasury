import styled, { css } from "styled-components";
import { useDark } from "../../context/theme";

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
  background: url(${(p) => p.unfilled});
  ${(p) =>
    p.filled &&
    css`
      background: url("/imgs/star.svg");
    `}
`;

export default function Stars({ rate = 0 }) {
  const dark = useDark();
  const unfilled = dark
    ? "/imgs/star-unfilled-dark.svg"
    : "/imgs/star-unfilled.svg";

  return (
    <Wrapper>
      {[...Array(5).keys()].map((item) => (
        <Star key={item} filled={item <= rate - 1} unfilled={unfilled} />
      ))}
    </Wrapper>
  );
}

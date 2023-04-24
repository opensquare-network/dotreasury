import styled, { css } from "styled-components";
import { useDark } from "../../context/theme";

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
    background-image: url(${(p) => p.unfilled});
  }
`;

const Star = styled.div`
  width: 16px;
  height: 16px;
  background-repeat: no-repeat;
  background-image: url(${(p) => p.unfilled});
  ${(p) =>
    p.filled &&
    css`
      background-image: url("/imgs/star.svg");
    `}
`;

export default function StarsAction({ rate, setRate }) {
  const dark = useDark();
  const unfilled = dark
    ? "/imgs/star-unfilled-dark.svg"
    : "/imgs/star-unfilled.svg";

  return (
    <Wrapper unfilled={unfilled}>
      {[...Array(5).keys()].map((item) => (
        <Star
          key={item}
          unfilled={unfilled}
          filled={item <= rate - 1}
          onClick={() => setRate(item + 1)}
        />
      ))}
    </Wrapper>
  );
}

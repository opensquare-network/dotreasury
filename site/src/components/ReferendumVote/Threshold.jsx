import styled, { css } from "styled-components";

const ThresholdScope = styled.div`
  position: absolute;
  top: 0;
  right: 1px;
  bottom: 0;
  left: 1px;
`;

const Threshold = styled.div`
  position: relative;
  ${(p) =>
    p.threshold
      ? css`
          left: ${p.threshold};
        `
      : css`
          left: 50%;
        `}
  width: 2px;
  height: 1rem;
  background-color: #dddddd;
  transform: translateX(-50%);
`;

export default function ThresholdComponent({ threshold }) {
  return (
    <ThresholdScope>
      <Threshold threshold={threshold} />
    </ThresholdScope>
  );
}

import React from "react";
import styled from "styled-components";

import Text from "./Text";

const CircleWrapper = styled.div`
  position: relative;
  width: ${(p) => p.size}px;
  height: ${(p) => p.size}px;
`;

const BackCircle = styled.div`
  position: absolute;
  width: ${(p) => p.size}px;
  height: ${(p) => p.size}px;
  border-radius: 50%;
  border: 8px solid var(--secondary);
`;

const InnerCircleWrapper = styled.div`
  position: absolute;
  width: ${(p) => p.size}px;
  height: ${(p) => p.size}px;
`;

const InnerCircle = styled.div`
  position: absolute;
  width: ${(p) => p.size - 1}px;
  height: ${(p) => p.size - 1}px;
  left: 1px;
  top: 1px;
  border-radius: 50%;
  border: 7px solid var(--primary);
`;

const InnerCircleLeft = styled(InnerCircle)`
  clip-path: polygon(0px 0px, 50% 0px, 50% 100%, 0 100%);
  transform: rotate(${(p) => p.turn}turn);
`;
const InnerCircleRight = styled(InnerCircle)`
  clip-path: polygon(50% 0px, 101% 0px, 101% 100%, 50% 100%);
  visibility: ${(p) => (p.overHalf ? "visible" : "hidden")};
`;

const InnerCircleMaskLeft = styled(BackCircle)`
  clip-path: polygon(0px 0px, 50% 0px, 50% 100%, 0 100%);
  visibility: ${(p) => (p.overHalf ? "hidden" : "visible")};
`;

const InnerCircleMaskRight = styled(BackCircle)`
  clip-path: polygon(52% 0px, 100% 0px, 100% 100%, 52% 100%);
  visibility: ${(p) => (p.overHalf ? "visible" : "hidden")};
`;

const PercentLable = styled(Text)`
  position: absolute;
  transform: translate(-50%, -50%);
  top: 50%;
  left: 50%;
  font-size: 12px;
`;

const CountDown = ({ percent = 0, size = 60 }) => {
  let percentInt = parseInt(percent);
  if (isNaN(percentInt) || percentInt < 0) {
    percentInt = 0;
  }
  let turn = percentInt / 100;
  if (percentInt > 100) {
    turn = 1;
  }
  const overHalf = percentInt > 50;
  return (
    <CircleWrapper size={size}>
      <BackCircle size={size} />
      <InnerCircleWrapper size={size}>
        <InnerCircleLeft turn={turn} overHalf={overHalf} size={size} />
        <InnerCircleMaskLeft overHalf={overHalf} size={size} />
        <InnerCircleMaskRight overHalf={overHalf} size={size} />
        <InnerCircleRight overHalf={overHalf} size={size} />
      </InnerCircleWrapper>
      <PercentLable>{`${percentInt}%`}</PercentLable>
    </CircleWrapper>
  );
};

export default CountDown;

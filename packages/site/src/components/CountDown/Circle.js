import React from "react";
import styled from "styled-components";

import Text from "../Text";

const CircleWrapper = styled.div`
  position: relative;
  width: 63px;
  height: 63px;
`

const BackCircle = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 5px solid rgba(0, 0, 0, 0.25);
  background: white;
`

const InnerCircleWrapper = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
`

const InnerCircle = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.25);
  border-radius: 50%;
  border: 5px solid rgba(0, 0, 0);
`

const InnerCircleLeft = styled(InnerCircle)`
  clip-path: polygon(0px 0px, 50% 0px, 50% 100%, 0 100%);
  transform: rotate(${p => p.turn}turn);
`
const InnerCircleRight = styled(InnerCircle)`
  clip-path: polygon(50% 0px, 100% 0px, 100% 100%, 50% 100%);
  visibility: ${p => p.overHalf ? "visible" : "hidden"};
`

const InnerCircleMaskLeft = styled(BackCircle)`
  clip-path: polygon(0px 0px, 50% 0px, 50% 100%, 0 100%);
  visibility: ${p => p.overHalf ? "hidden" : "visible"};
`

const InnerCircleMaskRight = styled(BackCircle)`
  clip-path: polygon(50% 0px, 100% 0px, 100% 100%, 50% 100%);
  visibility: ${p => p.overHalf ? "visible" : "hidden"};
`

const PercentLable = styled(Text)`
  position: absolute;
  transform: translate(-50%, -50%);
  top: 50%;
  left: 50%;
  font-size: 16px;
`

const Circle = ({percent = 0}) => {
  const turn = percent / 100;
  const overHalf = percent > 50;
  return (
    <CircleWrapper>
      <BackCircle />
      <InnerCircleWrapper>
        <InnerCircleLeft turn={turn} overHalf={overHalf} />
        <InnerCircleMaskLeft overHalf={overHalf} />
        <InnerCircleMaskRight overHalf={overHalf} />
        <InnerCircleRight overHalf={overHalf} />
      </InnerCircleWrapper>
      <PercentLable>{`${percent}%`}</PercentLable>
    </CircleWrapper>
  )
}

export default Circle;

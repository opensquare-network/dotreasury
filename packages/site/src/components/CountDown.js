import React from "react";
import styled from "styled-components";

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

const InnerCircleLeft = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.25);
  border-radius: 50%;
  border: 5px solid rgba(0, 0, 0);
  clip-path: polygon(0px 0px, 50% 0px, 50% 100%, 0 100%);
  transform: rotate(${p => p.turn}turn);
`
const InnerCircleRight = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.25);
  border-radius: 50%;
  border: 5px solid rgba(0, 0, 0);
  clip-path: polygon(50% 0px, 100% 0px, 100% 100%, 50% 100%);
  visibility: ${p => p.overHalf ? "visible" : "hidden"};
`

const InnerCircleMaskLeft = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 5px solid rgba(0, 0, 0, 0.25);
  background: white;
  clip-path: polygon(0px 0px, 50% 0px, 50% 100%, 0 100%);
  visibility: ${p => p.overHalf ? "hidden" : "visible"};
`

const InnerCircleMaskRight = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 5px solid rgba(0, 0, 0, 0.25);
  background: white;
  clip-path: polygon(50% 0px, 100% 0px, 100% 100%, 50% 100%);
  visibility: ${p => p.overHalf ? "visible" : "hidden"};
`

const PercentLable = styled.div`
  position: absolute;
  transform: translate(-50%, -50%);
  top: 50%;
  left: 50%;
  font-size: 16px;
`

const CountDown = ({percent = 0}) => {
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

export default CountDown;

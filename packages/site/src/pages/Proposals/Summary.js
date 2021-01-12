import React from "react";
import styled from "styled-components";

import Text from "../../components/Text";
import TextMinor from "../../components/TextMinor";
import CountDown from "../../components/CountDown";


const Wrapper = styled.div`
  background: #F8F8F8;
  padding: 16px 20px;
  border-radius: 8px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 16px;
  justify-content: space-between;
  overflow: scroll;
`

const Item = styled.div`
  min-width: 120px;
  &.grow {
    flex-grow: 1;
  }
  &.countdown {
    min-width: 0;
  }
  &.right {
    text-align: right;
  }
  &.spend-period {
    min-width: 180px;
  }
  & > div:last-child {
    justify-content: flex-end;
  }
`

const Title = styled(TextMinor)`
  line-height: 24px;
`

const Value = styled(Text)`
  line-height: 32px;
  font-weight: bold;
  font-size: 18px;
`

const Unit = styled(TextMinor)`
  line-height: 32px;
  font-weight: bold;
  font-size: 18px;
`

const ValueWrapper = styled.div`
  display: flex;
  gap: 4px;
`

const Summary = () => {
  return (
    <Wrapper>
      <Item>
        <Title>Proposal</Title>
        <Value>3</Value>
      </Item>
      <Item>
        <Title>Total</Title>
        <Value>106</Value>
      </Item>
      <Item className="grow">
        <Title>Approved</Title>
        <Value>12</Value>
      </Item>
      <Item className="right">
        <Title>Available</Title>
        <ValueWrapper>
          <Value>50.00</Value>
          <Unit>KSM</Unit>
        </ValueWrapper>
      </Item>
      <Item className="right">
        <Title>Next burn</Title>
        <ValueWrapper>
          <Value>3</Value>
          <Unit>KSM</Unit>
        </ValueWrapper>
      </Item>
      <Item className="right spend-period">
        <Title>Spend period</Title>
        <ValueWrapper>
          <Value>4</Value>
          <Unit>Days</Unit>
          <Value>10</Value>
          <Unit>hrs</Unit>
        </ValueWrapper>
      </Item>
      <Item className="countdown">
        <CountDown percent={25} />
      </Item>
    </Wrapper>
  )
}

export default Summary;

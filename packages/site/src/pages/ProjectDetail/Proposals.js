import React from "react";
import styled from "styled-components";

import { PRIMARY_THEME_COLOR } from "../../constants";
import SubTitle from "../../components/SubTitle";
import Text from "../../components/Text";
import TextMinor from "../../components/TextMinor";
import Card from "../../components/Card";
import ButtonList from "./ButtonList";

const Header = styled(SubTitle)`
  margin-bottom: 16px;
`;

const Wrapper = styled.div`
  display: flex;
  margin-bottom: 32px;
  & > div:last-child {
    flex-grow: 1;
    margin-left: 12px;
  }
`;

const VerticalWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: stretch;
  & > div:last-child {
    flex-grow: 1;
  }
`;

const CircleWrapper = styled.div`
  width: 24px;
  height: 24px;
  padding: 6px;
  div {
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    border: 3px solid ${PRIMARY_THEME_COLOR};
    border-radius: 50%;
  }
  flex: 0 0 auto;
`;

const Bar = styled.div`
  width: 2px;
  margin: 0 11px;
  background: #F292A4;
  flex: 0 0 auto;
`;

const FlexWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
`

const TextWrapper = styled.div`
  flex-grow: 1;
  & > p {
    display: inline;
  }
`

const BoldText = styled(Text)`
  font-weight: 500;
`

const NumberText = styled(Text)`
  color: ${PRIMARY_THEME_COLOR};
  font-weight: 500;
  margin-right: 12px;
`

const CardWrapper = styled(Card)`
  padding: 8px 0;
  margin-top: 8px;
  margin-bottom: 32px;
`

const Item = styled.div`
  padding: 4px 16px;
  display: flex;
  flex-wrap: wrap;
  :not(:last-child) {
    margin-bottom: 8px;
  }
  & > :first-child {
    min-width: 140px;
  }
`

const ExpenseWrapper = styled.div`
  display: flex;
  & > .unit {
    margin-left: 8px;
  }
  & > .dollar {
    margin-left: 8px;
  }
`

const TextDollar = styled(Text)`
  color: rgba(29, 37, 60, 0.24);
`


const Proposals = () => {
  return (
    <>
      <Header>Proposals</Header>
      <Wrapper>
        <VerticalWrapper>
          <CircleWrapper>
            <div />
          </CircleWrapper>
          <Bar />
        </VerticalWrapper>
        <VerticalWrapper>
          <FlexWrapper>
            <TextWrapper>
              <NumberText>#58</NumberText>
              <BoldText>Praesent amet bibendum pharetra, condimentum odio  aliquet nulla mauris quis.</BoldText>
            </TextWrapper>
            <ButtonList />
          </FlexWrapper>
          <CardWrapper>
            <Item>
              <BoldText>Expense</BoldText>
              <ExpenseWrapper>
                <Text>50.00</Text>
                <TextMinor className="unit">KSM</TextMinor>
                <TextDollar className="dollar">≈ $21,123.00</TextDollar>
              </ExpenseWrapper>
            </Item>
            <Item>
              <BoldText>Achievement</BoldText>
              <div>
                <TextMinor>1. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Augue sagittis integer diam et eleifend mi quam nec.</TextMinor>
                <TextMinor>2. Semper sit lorem mattis ornare ipsum turpis congue urna, gravida.</TextMinor>
                <TextMinor>3. Ultrices eros, ornare elementum arcu, aenean.</TextMinor>
                <TextMinor>4. Felis egestas fringilla tempor ac orci ridiculus.</TextMinor>
              </div>
            </Item>
          </CardWrapper>
        </VerticalWrapper>
      </Wrapper>
    </>
  )
}

export default Proposals;

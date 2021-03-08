import React from "react";
import styled from "styled-components";
import { NavLink } from "react-router-dom";

import { PRIMARY_THEME_COLOR } from "../../constants";
import SubTitle from "../../components/SubTitle";
import Text from "../../components/Text";
import TextMinor from "../../components/TextMinor";
import Card from "../../components/Card";

const Header = styled(SubTitle)`
  margin-bottom: 16px;
`;

const Wrapper = styled.div`
  display: flex;
  & > div:last-child {
    flex-grow: 1;
    margin-left: 12px;
  }
  &:last-child {
    .bar {
      visibility: hidden;
    }
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
  & * {
    display: inline;
  }
  & > a > p:hover {
    text-decoration: underline
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


const Proposals = ({ data }) => {
  if (data) {
    return (
      <>
        <Header>Proposals</Header>
        <div>
          {(data || []).map((item, index) => (
            <Wrapper key={index}>
              <VerticalWrapper>
                <CircleWrapper>
                  <div />
                </CircleWrapper>
                <Bar className="bar" />
              </VerticalWrapper>
              <VerticalWrapper>
                <FlexWrapper>
                  <TextWrapper>
                    <NavLink to={`/proposals/${item.proposalId}`}>
                      <NumberText>{`#${item.proposalId}`}</NumberText>
                    </NavLink>
                    <BoldText>{item.title}</BoldText>
                  </TextWrapper>
                </FlexWrapper>
                <CardWrapper>
                  <Item>
                    <BoldText>Expense</BoldText>
                    <ExpenseWrapper>
                      <Text>{item.amount ?? 0}</Text>
                      <TextMinor className="unit">{item.token?.toUpperCase()}</TextMinor>
                      {item.amount && item.proposeTimePrice &&
                      <TextDollar className="dollar">{`≈ $${(item.amount * item.proposeTimePrice).toFixed(2).replace(/\D00/, "")}`}</TextDollar>}
                    </ExpenseWrapper>
                  </Item>
                  <Item>
                    <BoldText>Achievement</BoldText>
                    <div>
                      {(item.achievements || []).map((item, index) => (<TextMinor key={index}>{item}</TextMinor>))}
                    </div>
                  </Item>
                </CardWrapper>
              </VerticalWrapper>
            </Wrapper>
          ))}
        </div>
      </>
    )
  } else {
    return null;
  }
}

export default Proposals;

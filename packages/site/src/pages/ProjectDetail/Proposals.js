import React from "react";
import styled from "styled-components";
import { NavLink } from "react-router-dom";
import { Image } from "semantic-ui-react";

import { PRIMARY_THEME_COLOR } from "../../constants";
import Text from "../../components/Text";
import TextMinor from "../../components/TextMinor";
import Card from "../../components/Card";
import { toLocaleStringWithFixed } from "../../utils";

const Wrapper = styled(Card)`
  padding: 20px 24px;
  margin-bottom: 24px;
`;

const Header = styled.div`
  font-weight: 700;
  font-size: 16px;
  line-height: 24px;
  color: rgba(0, 0, 0, 0.9);
  margin-bottom: 20px;
`;

const ContentWrapper = styled.div`
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
  background: #f292a4;
  flex: 0 0 auto;
`;

const FlexWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
`;

const TextWrapper = styled.div`
  flex-grow: 1;
  & * {
    display: inline !important;
    line-height: 24px !important;
  }
  > img {
    margin-right: 4px;
  }
  & > a > p:hover {
    text-decoration: underline;
  }
`;

const BoldText = styled(Text)`
  font-weight: 500;
`;

const NumberText = styled(Text)`
  color: ${PRIMARY_THEME_COLOR};
  font-weight: 500;
  margin-right: 12px;
`;

const CardWrapper = styled.div`
  padding: 8px 0;
  margin-top: 8px;
  margin-bottom: 32px;
`;

const Item = styled.div`
  padding: 4px 0px;
  display: flex;
  @media screen and (max-width: 640px) {
    flex-wrap: wrap;
  }
  :not(:last-child) {
    margin-bottom: 8px;
  }
  & > :first-child {
    min-width: 140px;
  }
`;

const ExpenseWrapper = styled.div`
  display: flex;
  & > .unit {
    margin-left: 8px;
  }
  & > .dollar {
    margin-left: 8px;
  }
`;

const TextDollar = styled(Text)`
  color: rgba(29, 37, 60, 0.24);
`;

const Proposals = ({ data }) => {
  if (data) {
    return (
      <Wrapper>
        <Header>Proposals</Header>
        <div>
          {(data || []).map((item, index) => (
            <ContentWrapper key={index}>
              <VerticalWrapper>
                <CircleWrapper>
                  <div />
                </CircleWrapper>
                <Bar className="bar" />
              </VerticalWrapper>
              <VerticalWrapper>
                <FlexWrapper>
                  <TextWrapper>
                    <Image
                      width={24}
                      src={
                        item.token === "ksm"
                          ? "/imgs/logo-kusama.svg"
                          : "/imgs/logo-polkadot.svg"
                      }
                    />
                    <NavLink to={`/${item.token}/proposals/${item.proposalId}`}>
                      <NumberText>{`#${item.proposalId}`}</NumberText>
                    </NavLink>
                    <BoldText>{item.title}</BoldText>
                  </TextWrapper>
                </FlexWrapper>
                <CardWrapper>
                  <Item>
                    <Text>Expense</Text>
                    <ExpenseWrapper>
                      <Text>{item.amount.toLocaleString() ?? 0}</Text>
                      <TextMinor className="unit">
                        {item.token?.toUpperCase()}
                      </TextMinor>
                      {item.amount && item.proposeTimePrice && (
                        <TextDollar className="dollar">{`≈ $${toLocaleStringWithFixed(
                          item.amount * item.proposeTimePrice,
                          2
                        ).replace(/\D00/, "")}`}</TextDollar>
                      )}
                    </ExpenseWrapper>
                  </Item>
                  {(item.achievements || []).length > 0 && (
                    <Item>
                      <Text>Achievement</Text>
                      <div>
                        {(item.achievements || []).map((item, index) => (
                          <TextMinor key={index}>{item}</TextMinor>
                        ))}
                      </div>
                    </Item>
                  )}
                </CardWrapper>
              </VerticalWrapper>
            </ContentWrapper>
          ))}
        </div>
      </Wrapper>
    );
  } else {
    return null;
  }
};

export default Proposals;

import React from "react";
import styled from "styled-components";
import { NavLink } from "react-router-dom";
import { Image } from "semantic-ui-react";

import { PRIMARY_THEME_COLOR } from "../../constants";
import Text from "../../components/Text";
import TextMinor from "../../components/TextMinor";
import Card from "../../components/Card";
import { getPrecision, toLocaleStringWithFixed, toPrecision } from "../../utils";
import { useSelector } from "react-redux";
import { chainSymbolSelector } from "../../store/reducers/chainSlice";

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

const NumberTextAbbr = styled(NumberText)`
  display: inline-block !important;
  max-width: 135px;
  height: 17px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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

const types = Object.freeze({
  proposal: "proposal",
  tip: "tip",
  childBounty: "child-bounty",
})

function getFundLink(item = {}) {
  if (item.type === types.tip) {
    return `tips/${item.tipId}`;
  } else if (item.type === types.childBounty) {
    return `child-bounties/${item.id}`;
  } else if (item.type === types.proposal) {
    return `proposals/${item.proposalId}`;
  }

  throw new Error(`Unknown project fund type ${ item?.type }`);
}

function getFundId(item = {}) {
  if (item.type === types.tip) {
    return item.tipId;
  } else if (item.type === types.childBounty) {
    return item.id;
  } else if (item.type === types.proposal) {
    return item.proposalId;
  }

  throw new Error(`Unknown project fund type ${ item?.type }`);
}

function getFundTypeName(type) {
  if (type === types.tip) {
    return 'Tip';
  } else if (type === types.childBounty) {
    return 'Child Bounty';
  } else if (type === types.proposal) {
    return "Proposal";
  }

  throw new Error(`Unknown project fund type ${ type }`);
}

const Proposals = ({data}) => {
  const symbol = useSelector(chainSymbolSelector);

  if (data) {
    return (
      <Wrapper>
        <Header>Proposals</Header>
        <div>
          {(data || []).map((item, index) => {
              const link = getFundLink(item);
              const id = getFundId(item);
              return <ContentWrapper key={index}>
                <VerticalWrapper>
                  <CircleWrapper>
                    <div/>
                  </CircleWrapper>
                  <Bar className="bar"/>
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
                      <NavLink to={`/${item.token}/${link}`}>
                        <NumberTextAbbr>{ `${ getFundTypeName(item.type) } #${ id }` }</NumberTextAbbr>
                      </NavLink>
                      <BoldText>{item.title ?? item.reason}</BoldText>
                    </TextWrapper>
                  </FlexWrapper>
                  <CardWrapper>
                    <Item>
                      <Text>{item.type === "tip" ? "Tip" : "Expense"}</Text>
                      <ExpenseWrapper>
                        <Text>{
                          Number(toPrecision(item.value, getPrecision(symbol))).toLocaleString()
                        }</Text>
                        <TextMinor className="unit">
                          {item.token?.toUpperCase()}
                        </TextMinor>
                        <TextDollar className="dollar">{`≈ $${toLocaleStringWithFixed(
                          item.fiatValue,
                          2
                        ).replace(/\D00/, "")}`}</TextDollar>
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
            }
          )}
        </div>
      </Wrapper>
    );
  } else {
    return null;
  }
};

export default Proposals;

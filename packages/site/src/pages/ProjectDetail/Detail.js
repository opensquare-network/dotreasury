import React from "react";
import styled from "styled-components";
import { Image } from "semantic-ui-react";

import Card from "../../components/Card";
import Title from "../../components/Title";
import TextMinor from "../../components/TextMinor";
import ProjectProposals from "../../components/ProjectProposals";
import ProjectExpense from "../../components/ProjectExpense";
import Links from "./Links";

const Wrapper = styled(Card)`
  padding: 24px;
  margin-bottom: 24px;
  display: flex;
  @media screen and (max-width: 481px) {
    & * {
      text-align: left !important;
    }
  }

  @media screen and (max-width: 900px) {
    display: block;
  }
`;

const NetworkDetailWrapper = styled.div`
  display: flex;
  flex: 1;
  padding-right: 48px;

  @media screen and (max-width: 900px) {
    padding-right: 0;
    display: block;
  }
`;

const IconImage = styled(Image)`
  margin-right: 24px;

  @media screen and (max-width: 900px) {
    margin-right: 0;
    margin-bottom: 12px;
  }
`;

const NetworkDetailInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const NameWrapper = styled.h3`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
`;

const NameTitle = styled(Title)`
  font-size: 18px;
  font-weight: 600;
  line-height: 28px;
`;

const ProposalWrapper = styled.div`
  flex-basis: 160px;
`;

const CustomTextMinor = styled(TextMinor)`
  margin-bottom: 4px;
`;

const ExpenseContentWrapper = styled.div`
  margin-top: 16px;
`;

const Divider = styled.div`
  width: 1px;
  height: inherit;
  background-color: #f4f4f4;
  margin: 0 24px;

  @media screen and (max-width: 900px) {
    width: 100%;
    height: 1px;
    margin: 24px 0;
  }
`;

const ProposalExpenseWrapper = styled.div`
  flex-basis: 400px;
`;

const LinksWrapper = styled.div`
  margin-top: 16px;
`;

const Detail = ({ projectData }) => {
  const { name, logo, description, relatedLinks } = projectData;
  const {
    fundsCount: {
      kusama: kusamaFundCount = 0,
      polkadot: polkadotFundCount = 0,
    } = {},
    fundsValue: {
      kusama: kusamaFundValue = 0,
      polkadot: polkadotFundValue = 0,
    } = {},
    fiatValue = 0,
  } = projectData;

  return (
    <Wrapper>
      <NetworkDetailWrapper>
        <IconImage
          src={logo ? `/imgs/projects/${logo}` : "/imgs/default-logo.svg"}
          width={58.67}
          height={58.67}
        />
        <NetworkDetailInfo>
          <div>
            <NameWrapper>
              <NameTitle>{name}</NameTitle>
            </NameWrapper>
            <TextMinor>{description}</TextMinor>
          </div>

          <LinksWrapper>
            <Links links={relatedLinks} />
          </LinksWrapper>
        </NetworkDetailInfo>
      </NetworkDetailWrapper>

      <Divider />

      <ProposalExpenseWrapper>
        <ProposalWrapper>
          <CustomTextMinor>Proposals</CustomTextMinor>
          <ProjectProposals
            dotProposalsCount={polkadotFundCount}
            ksmProposalsCount={kusamaFundCount}
          />
        </ProposalWrapper>

        <ExpenseContentWrapper>
          <CustomTextMinor>Expense</CustomTextMinor>
          <ProjectExpense
            expenseDot={polkadotFundValue}
            expenseKsm={kusamaFundValue}
            dollar={fiatValue}
          />
        </ExpenseContentWrapper>
      </ProposalExpenseWrapper>
    </Wrapper>
  );
};

export default Detail;

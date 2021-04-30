import React from "react";
import styled from "styled-components";
import { Image } from "semantic-ui-react";

import Card from "../../components/Card";
import Title from "../../components/Title";
import TextMinor from "../../components/TextMinor";
import ProjectProposals from "../../components/ProjectProposals";
import ProjectExpense from "../../components/ProjectExpense";

const Wrapper = styled(Card)`
  padding: 24px 32px;
  margin-bottom: 24px;
  display: flex;
  align-items: flex-start;
  flex-wrap: wrap;
  @media screen and (max-width: 481px) {
    & * {
      text-align: left !important;
    }
  }
`;

const IconImage = styled(Image)`
  margin-right: 32px;
`;

const NameContentWrapper = styled.div`
  flex: 1 1 774px;
`;

const NameWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const NameTitle = styled(Title)`
  font-size: 22px;
  font-weight: 700;
  line-height: 36px;
`;

const NameContent = styled(TextMinor)`
  text-align: justify;
`;

const ProposalWrapper = styled.div`
  flex-basis: 160px;
  > :last-child > * {
    font-weight: bold;
    font-size: 16px;
    line-height: 24px;
    text-align: right;
    color: rgba(0, 0, 0, 0.9);
  }
  @media screen and (max-width: 481px) {
    > :last-child {
      justify-content: flex-start;
    }
  }
`;

const CustomTextMinor = styled(TextMinor)`
  padding-top: 6px;
  text-align: right;
`;

const ExpenseContentWrapper = styled.div`
  margin-left: 32px;
  flex-basis: 160px;
  > :last-child > :first-child {
    font-weight: bold;
    font-size: 16px;
    line-height: 24px;
    color: rgba(0, 0, 0, 0.9);
  }
  @media screen and (max-width: 481px) {
    margin-left: 0;
    margin-right: 32px;
  }
`;

const Detail = ({ data, projectData }) => {
  const { name, logo, description, dollar } = data;
  const {
    expenseDot,
    expenseKsm,
    dotProposalsCount,
    ksmProposalsCount,
  } = projectData;

  return (
    <Wrapper>
      <IconImage
        src={logo ? `/imgs/projects/${logo}` : "/imgs/default-logo.svg"}
        width={96}
        height={96}
      />
      <NameContentWrapper>
        <NameWrapper>
          <NameTitle>{name}</NameTitle>
        </NameWrapper>
        <NameContent>{description}</NameContent>
      </NameContentWrapper>
      <ProposalWrapper>
        <CustomTextMinor>Proposals</CustomTextMinor>
        <ProjectProposals
          dotProposalsCount={dotProposalsCount}
          ksmProposalsCount={ksmProposalsCount}
        />
      </ProposalWrapper>
      <ExpenseContentWrapper>
        <CustomTextMinor>Expense</CustomTextMinor>
        <ProjectExpense
          expenseDot={expenseDot}
          expenseKsm={expenseKsm}
          dollar={dollar}
        />
      </ExpenseContentWrapper>
    </Wrapper>
  );
};

export default Detail;

import React from "react";

import ProjectProposals from "../../components/ProjectProposals";
import ProjectExpense from "../../components/ProjectExpense";
import InfoCard, { InfoCardExtraItem } from "../../components/InfoCard";

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
    <InfoCard
      icon={logo ? `/imgs/projects/${logo}` : "/imgs/default-logo.svg"}
      title={name}
      description={description}
      links={relatedLinks}
      extra={
        <>
          <InfoCardExtraItem label="Proposals">
            <ProjectProposals
              dotProposalsCount={polkadotFundCount}
              ksmProposalsCount={kusamaFundCount}
            />
          </InfoCardExtraItem>
          <InfoCardExtraItem label="Expense">
            <ProjectExpense
              expenseDot={polkadotFundValue}
              expenseKsm={kusamaFundValue}
              dollar={fiatValue}
            />
          </InfoCardExtraItem>
        </>
      }
    />
  );
};

export default Detail;

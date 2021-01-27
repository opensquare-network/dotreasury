import React, { useState } from "react";
import styled from "styled-components";

import Card from "../../components/Card";
import Doughnut from "../../components/Doughnut";
import LabelList from "./LabelList";
import Label from "./Label";
import Total from "./Total";
import {
  OVERVIEW_PROPOSALS_COLOR,
  OVERVIEW_TIPS_COLOR,
  OVERVIEW_BOUNTIES_COLOR,
  OVERVIEW_BURNT_COLOR,
} from "../../constants";

const CardWrapper = styled(Card)`
  position: relative;
  margin-top: 24px;
  height: 304px;
  padding: 32px 20px;
  border-color: #EEE;
`;

const DoughnutCard = ({ proposals, tips, bounties, burnt }) => {
  const [proposalsDisabled, setProposalsDisabled] = useState(false);
  const [tipsDisabled, setTipsDisabled] = useState(false);
  const [bountiesDisabled, setBountiesDisabled] = useState(false);
  const [burntDisabled, setBurntDisabled] = useState(false);
  const total = (
    (proposalsDisabled ? 0 : proposals) +
    (tipsDisabled ? 0 : tips) +
    (bountiesDisabled ? 0 : bounties) +
    (burntDisabled ? 0 : burnt)
  )
    .toFixed(2)
    .replace(/\D00/, "");

  const onToggleProposals = () => {
    if (!proposalsDisabled && tipsDisabled && bountiesDisabled && burntDisabled)
      return;
    setProposalsDisabled(!proposalsDisabled);
  };
  const onToggleTips = () => {
    if (proposalsDisabled && !tipsDisabled && bountiesDisabled && burntDisabled)
      return;
    setTipsDisabled(!tipsDisabled);
  };
  const onToggleBouties = () => {
    if (proposalsDisabled && tipsDisabled && !bountiesDisabled && burntDisabled)
      return;
    setBountiesDisabled(!bountiesDisabled);
  };
  const onToggleBurnt = () => {
    if (proposalsDisabled && tipsDisabled && bountiesDisabled && !burntDisabled)
      return;
    setBurntDisabled(!burntDisabled);
  };

  return (
    <CardWrapper>
      <Total total={total} />
      <Doughnut
        proposals={proposalsDisabled ? 0 : proposals}
        tips={tipsDisabled ? 0 : tips}
        bounties={bountiesDisabled ? 0 : bounties}
        burnt={burntDisabled ? 0 : burnt}
      />
      <LabelList>
        <Label
          name="Proposals"
          value={proposals}
          color={OVERVIEW_PROPOSALS_COLOR}
          disabled={proposalsDisabled}
          onToggleDisabled={onToggleProposals}
        />
        <Label
          name="Tips"
          value={tips}
          color={OVERVIEW_TIPS_COLOR}
          disabled={tipsDisabled}
          onToggleDisabled={onToggleTips}
        />
        <Label
          name="Bounties"
          value={bounties}
          color={OVERVIEW_BOUNTIES_COLOR}
          disabled={bountiesDisabled}
          onToggleDisabled={onToggleBouties}
        />
        <Label
          name="Burnt"
          value={burnt}
          color={OVERVIEW_BURNT_COLOR}
          disabled={burntDisabled}
          onToggleDisabled={onToggleBurnt}
        />
      </LabelList>
    </CardWrapper>
  );
};

export default DoughnutCard;

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
  OVERVIEW_BOUNTIES_COLOR
} from "../../constants";

const CardWrapper = styled(Card)`
  position: relative;
  margin-top: 24px;
  height: 304px;
  padding: 32px 20px;
`

const DoughnutCard = ({proposals, tips, bounties}) => {
  const [proposalsDisabled, setProposalsDisabled] = useState(false);
  const [tipsDisabled, setTipsDisabled] = useState(false);
  const [bountiesDisabled, setBountiesDisabled] = useState(false);
  const total = proposals + tips + bounties;
  const onToggleProposals = () => {
    setProposalsDisabled(!proposalsDisabled);
  }
  const onToggleTips = () => {
    setTipsDisabled(!tipsDisabled);
  }
  const onToggleBouties = () => {
    setBountiesDisabled(!bountiesDisabled);
  }

  return (
    <CardWrapper>
      <Total total={total} />
      <Doughnut proposals={proposalsDisabled ? 0 : proposals} tips={tipsDisabled ? 0 : tips} bounties={bountiesDisabled ? 0 : bounties} />
      <LabelList>
        <Label name="Proposals" color={OVERVIEW_PROPOSALS_COLOR} disabled={proposalsDisabled} onToggleDisabled={onToggleProposals} />
        <Label name="Tips" color={OVERVIEW_TIPS_COLOR} disabled={tipsDisabled} onToggleDisabled={onToggleTips} />
        <Label name="Bounties" color={OVERVIEW_BOUNTIES_COLOR} disabled={bountiesDisabled} onToggleDisabled={onToggleBouties} />
      </LabelList>
    </CardWrapper>
  )
}

export default DoughnutCard;

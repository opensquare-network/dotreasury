import React, { useState, useEffect } from "react";
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
  const [total, setTotal] = useState(0);
  useEffect(() => {
    const total = (proposalsDisabled ? 0 : proposals) + (tipsDisabled ? 0 : tips) + (bountiesDisabled ? 0 : bounties);
    setTotal(total.toFixed(2).replace(/\D00/, ""))
  }, [proposals, tips, bounties, proposalsDisabled, tipsDisabled, bountiesDisabled])

  const onToggleProposals = () => {
    if (!proposalsDisabled && tipsDisabled && bountiesDisabled) return;
    setProposalsDisabled(!proposalsDisabled);
  }
  const onToggleTips = () => {
    if (proposalsDisabled && !tipsDisabled && bountiesDisabled) return;
    setTipsDisabled(!tipsDisabled);
  }
  const onToggleBouties = () => {
    if (proposalsDisabled && tipsDisabled && !bountiesDisabled) return;
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

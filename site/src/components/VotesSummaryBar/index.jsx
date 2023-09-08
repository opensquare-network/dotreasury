import styled from "styled-components";
import ProgressBar from "./ProgressBar";
import BigNumber from "bignumber.js";
import Tooltip from "../Tooltip";
import VoteTooltip from "./VoteTooltip";

const Wrapper = styled.div`
  display: inline-flex;
  align-items: center;
  width: 20px;
  height: 15px;
`;

export default function VotesSummaryBar({ tally }) {
  const { ayes = 0, nays = 0 } = tally || {};
  const total = new BigNumber(ayes).plus(nays);
  let ayesPercent = 50;
  let naysPercent = 50;
  if (total.gt(0)) {
    ayesPercent = Math.round(new BigNumber(ayes).div(total).toNumber() * 100);
    naysPercent = Math.round(new BigNumber(nays).div(total).toNumber() * 100);
  }
  return (
    <Tooltip
      tooltipContent={
        <VoteTooltip
          ayes={ayes}
          nays={nays}
          ayesPercent={ayesPercent}
          naysPercent={naysPercent}
        />
      }
    >
      <Wrapper>
        <ProgressBar ayesPercent={ayesPercent} naysPercent={naysPercent} />
      </Wrapper>
    </Tooltip>
  );
}

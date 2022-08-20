import React from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import BigNumber from "bignumber.js";
import Threshold from "./Threshold";
import { getPrecision, toPrecision } from "../../utils";
import { chainSymbolSelector } from "../../store/reducers/chainSlice";
import {
  getThresholdOfSimplyMajority,
  getThresholdOfSuperMajorityAgainst,
  getThresholdOfSuperMajorityApprove,
} from "./util";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const ProposalArgsWrapper = styled.div`
  padding-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ProposalArgsItemWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  & > :not(:last-child) {
    margin-right: 8px;
  }
  flex-wrap: wrap;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  & > .title {
    color: rgba(0, 0, 0, 0.65);
  }
  & > .value {
    color: rgba(0, 0, 0, 0.9);
    word-break: break-word;
    :not(:first-child) > * {
      align-items: flex-start;
    }
  }
`;

const BarWrapper = styled.div`
  position: relative;
`;

const BarContainer = styled.div`
  margin-bottom: 1rem;
  display: flex;
  gap: ${(p) => p.gap}px;
  height: 8px;
  width: 100%;
  border-radius: 4px;
  overflow: hidden;
`;

const AyesBar = styled.div`
  background-color: #0eab0e;;
  width: ${(p) => p.precent}%;
  height: 100%;
`;

const NaysBar = styled.div`
  background-color: #e90b0b;
  width: ${(p) => p.precent}%;
  height: 100%;
`;

const Headers = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  font-weight: 500;
  font-size: 12px;
  line-height: 16px;
  font-size: 12px;

  span:nth-child(2) {
    text-align: center;
    white-space: nowrap;
  }

  span:nth-child(3) {
    text-align: right;
  }
`;

const Contents = styled(Headers)`
  font-weight: 500;
  font-size: 12px;
  line-height: 16px;
  color: rgba(0, 0, 0, 0.9);
`;

const NoData = styled.div`
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  color: rgba(0, 0, 0, 0.3);
`;

const ReferendumVote = ({ threshold, tally, electorate }) => {
  const symbol = useSelector(chainSymbolSelector);
  const decimals = getPrecision(symbol);

  const nAyes = toPrecision(tally?.ayes ?? 0, decimals);
  const nNays = toPrecision(tally?.nays ?? 0, decimals);
  const nTurnout = toPrecision(tally?.turnout ?? 0, decimals);
  const nElectorate = toPrecision(electorate ?? 0, decimals);

  let nAyesPercent = 50;
  let nNaysPercent = 50;
  let gap = 2;
  const nTotal = new BigNumber(nAyes).plus(nNays);
  if (nTotal.gt(0)) {
    nAyesPercent = Math.round(
      new BigNumber(nAyes).div(nTotal).toNumber() * 100
    );
    nNaysPercent = 100 - nAyesPercent;
    if (nAyesPercent === 100 || nNaysPercent === 100) {
      gap = 0;
    }
  }

  const argItems = [
    {
      title: "Aye",
      value: nAyes,
    },
    {
      title: "Nay",
      value: nNays,
    },
    {
      title: "Turnout",
      value: nTurnout,
    },
    {
      title: "Electorate",
      value: nElectorate,
    }
  ];

  if (!tally || !electorate) {
    return <NoData>Unable to load the data</NoData>;
  }

  return (
    <Wrapper>
      <BarWrapper>
        <BarContainer gap={gap}>
          <AyesBar precent={nAyesPercent} />
          <NaysBar precent={nNaysPercent} />

          {(threshold || "").toLowerCase() === "simplemajority" && (
            <Threshold threshold={getThresholdOfSimplyMajority()} />
          )}

          {(threshold || "").toLowerCase() === "supermajorityapprove" && (
            <Threshold
              threshold={getThresholdOfSuperMajorityApprove(
                tally?.turnout ?? 0,
                electorate
              )}
            />
          )}

          {(threshold || "").toLowerCase() === "supermajorityagainst" && (
            <Threshold
              threshold={getThresholdOfSuperMajorityAgainst(
                tally?.turnout ?? 0,
                electorate
              )}
            />
          )}
        </BarContainer>
      </BarWrapper>

      <div style={{ display: "flex", gap: "4px", flexDirection: "column" }}>
        <Headers>
          <span>Aye</span>
          <span>Passing threshold</span>
          <span>Nay</span>
        </Headers>

        <Contents>
          <span>{nAyesPercent}%</span>
          <span>{threshold}</span>
          <span>{nNaysPercent}%</span>
        </Contents>
      </div>

      {argItems && argItems.length > 0 && (
        <ProposalArgsWrapper>
          {argItems.map(({ title, value }) => (
            <ProposalArgsItemWrapper key={title}>
              <div className="title">{title}</div>
              <div className="value">
                {`${
                  Math.round(value) === value ? "" : "≈ "
                }${Math.round(value).toLocaleString()} ${symbol}`}
              </div>
            </ProposalArgsItemWrapper>
          ))}
        </ProposalArgsWrapper>
      )}
    </Wrapper>
  );
};

export default ReferendumVote;

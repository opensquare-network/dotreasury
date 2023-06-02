import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import Text from "../../../components/Text";
import { gap } from "../../../styles/tailwindcss";
import Card from "../../../components/Card";
import { h4_16_semibold } from "../../../styles/text";
import Legend from "./Legend";
import Chart from "./Chart";
import { useDispatch, useSelector } from "react-redux";
import { fetchSpendPeriods, spendPeriodsSelector } from "../../../store/reducers/overviewSlice";
import { chainSelector, chainSymbolSelector } from "../../../store/reducers/chainSlice";
import { getPrecision, toPrecision } from "../../../utils";

const Title = styled(Text)`
  margin-bottom: 16px;
  ${h4_16_semibold};
`;

const CardWrapper = styled(Card)`
  padding: 24px;
  @media screen and (max-width: 600px) {
    border-radius: 0;
  }
`;

const ContentWrapper = styled.div`
  display: flex;
  ${gap(24)};
  @media screen and (max-width: 800px) {
    flex-direction: column;
  }
`;

const defaultLegends = [
  {
    label: "Proposal",
    color: "#FC7C91",
    enabled: true,
    getValue: (period) => period.totalProposalsValue,
    getCount: (period) => period.proposals.length,
    getFiat: (period) => period.totalProposalsFiat,
  },
  {
    label: "Tips",
    color: "#FCCF75",
    enabled: true,
    getValue: (period) => period.totalTipsValue,
    getCount: (period) => period.tips.length,
    getFiat: (period) => period.totalTipsFiat,
  },
  {
    label: "Bounties",
    color: "#928FF2",
    enabled: true,
    getValue: (period) => period.totalBountiesValue,
    getCount: (period) => period.bounties.length,
    getFiat: (period) => period.totalBountiesFiat,
  },
  {
    label: "Burnt",
    color: "#FCA97C",
    enabled: false,
    getValue: (period) => period.totalBurntValue,
    getCount: (period) => period.burnt.length,
    getFiat: (period) => period.totalBurntFiat,
  },
];

function sum(values) {
  return values.reduce((acc, cur) => acc + cur, 0);
}

export default function SpendPeriod() {
  const dispatch = useDispatch();
  const chain = useSelector(chainSelector);
  const symbol = useSelector(chainSymbolSelector);
  const precision = getPrecision(symbol);
  const [legends, setLegends] = useState(defaultLegends);
  const spendPeriods = useSelector(spendPeriodsSelector);

  useEffect(() => {
    dispatch(fetchSpendPeriods(chain));
  }, [dispatch, chain]);

  const data = useMemo(() => {
    if (!spendPeriods) return [];

    return spendPeriods.map((period) => {
      const totalProposalsValue = sum(period.proposals.map((proposal) => toPrecision(proposal.value, precision, false)));
      const totalTipsValue = sum(period.tips.map((tip) => toPrecision(tip.value, precision, false)));
      const totalBountiesValue = sum(period.bounties.map((bounty) => toPrecision(bounty.value, precision, false)));
      const totalBurntValue = sum(period.burnt.map((burnt) => toPrecision(burnt.value, precision, false)));
      return {
        ...period,
        totalProposalsValue,
        totalTipsValue,
        totalBountiesValue,
        totalBurntValue,
        totalProposalsFiat: totalProposalsValue * period.symbolPrice,
        totalTipsFiat: totalTipsValue * period.symbolPrice,
        totalBountiesFiat: totalBountiesValue * period.symbolPrice,
        totalBurntFiat: totalBurntValue * period.symbolPrice,
      };
    });
  }, [spendPeriods, precision]);

  return (
      <CardWrapper>
        <Title>Spend Period</Title>
        <ContentWrapper>
          <Legend legends={legends} setLegends={setLegends} />
          <Chart legends={legends.filter(item => item.enabled)} data={data} />
        </ContentWrapper>
      </CardWrapper>
    );
}

import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import Text from "../../../components/Text";
import { gap } from "../../../styles/tailwindcss";
import Card from "../../../components/Card";
import { h4_16_semibold } from "../../../styles/text";
import Chart from "./Chart";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchIncomePeriods,
  fetchSpendPeriods,
  incomePeriodsSelector,
  spendPeriodsSelector,
} from "../../../store/reducers/overviewSlice";
import { chainSymbolSelector } from "../../../store/reducers/chainSlice";
import { getPrecision, toPrecision } from "../../../utils";
import { sum } from "../../../utils/math";
import { useTheme } from "../../../context/theme";

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

function useLegends() {
  const theme = useTheme();

  const [incomeLegends, setIncomeLegends] = useState([
    {
      label: "Inflation",
      color: theme.pink500,
      enabled: true,
      getValue: (period) => period.totalInflationValue,
    },
    {
      label: "Slashes",
      color: theme.pink400,
      enabled: true,
      getValue: (period) => period.totalSlashesValue,
    },
    {
      label: "Transfers",
      color: theme.pink300,
      enabled: true,
      getValue: (period) => period.totalTransfersValue,
    },
    {
      label: "Big Others",
      color: theme.pink200,
      enabled: true,
      getValue: (period) => period.totalBigOthersValue,
    },
  ]);
  const [spendLegends, setSpendLegends] = useState([
    {
      label: "Proposals",
      color: theme.yellow500,
      enabled: true,
      getValue: (period) => 0 - period.totalProposalsValue,
      getCount: (period) => period.proposals.length,
      getFiat: (period) => period.totalProposalsFiat,
    },
    {
      label: "Tips",
      color: theme.yellow400,
      enabled: true,
      getValue: (period) => 0 - period.totalTipsValue,
      getCount: (period) => period.tips.length,
      getFiat: (period) => period.totalTipsFiat,
    },
    {
      label: "Bounties",
      color: theme.yellow300,
      enabled: true,
      getValue: (period) => 0 - period.totalBountiesValue,
      getCount: (period) => period.bounties.length,
      getFiat: (period) => period.totalBountiesFiat,
    },
    {
      label: "Burnt",
      color: theme.yellow200,
      enabled: true,
      getValue: (period) => 0 - period.totalBurntValue,
      getCount: (period) => period.burnt.length,
      getFiat: (period) => period.totalBurntFiat,
    },
  ]);

  return {
    incomeLegends,
    spendLegends,
    setIncomeLegends,
    setSpendLegends,
  };
}

export default function SpendPeriod() {
  const dispatch = useDispatch();
  const symbol = useSelector(chainSymbolSelector);
  const precision = getPrecision(symbol);
  const { incomeLegends, spendLegends } = useLegends();
  const spendPeriods = useSelector(spendPeriodsSelector);
  const incomePeriods = useSelector(incomePeriodsSelector);

  useEffect(() => {
    dispatch(fetchIncomePeriods());
    dispatch(fetchSpendPeriods());
  }, [dispatch]);

  const incomeData = useMemo(() => {
    if (!incomePeriods) return [];

    return incomePeriods.map((period) => {
      const totalInflationValue = toPrecision(
        period.income.inflation,
        precision,
        false,
      );
      const totalSlashesValue = toPrecision(
        period.income.slash,
        precision,
        false,
      );
      const totalTransfersValue = toPrecision(
        period.income.transfer,
        precision,
        false,
      );
      const totalBigOthersValue = toPrecision(
        period.income.others,
        precision,
        false,
      );

      return {
        ...period,
        totalInflationValue,
        totalSlashesValue,
        totalTransfersValue,
        totalBigOthersValue,
      };
    });
  }, [incomePeriods, precision]);

  const spendData = useMemo(() => {
    if (!spendPeriods) return [];

    return spendPeriods.map((period) => {
      const totalProposalsValue = sum(
        period.proposals.map((proposal) =>
          toPrecision(proposal.value, precision, false),
        ),
      );
      const totalTipsValue = sum(
        period.tips.map((tip) => toPrecision(tip.value, precision, false)),
      );
      const totalBountiesValue = sum(
        period.bounties.map((bounty) =>
          toPrecision(bounty.value, precision, false),
        ),
      );
      const totalBurntValue = sum(
        period.burnt.map((burnt) => toPrecision(burnt.value, precision, false)),
      );
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
      <Title>Income & Spend Periods</Title>
      <ContentWrapper>
        {/* <Legend legends={legends} setLegends={setLegends} /> */}
        <Chart
          incomePeriodsLegends={incomeLegends.filter((item) => item.enabled)}
          incomePeriodsData={incomeData}
          spendPeriodsLegends={spendLegends.filter((item) => item.enabled)}
          spendPeriodsData={spendData}
        />
      </ContentWrapper>
    </CardWrapper>
  );
}

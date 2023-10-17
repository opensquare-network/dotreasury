import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import Text from "../../../components/Text";
import Card from "../../../components/Card";
import { h4_16_semibold } from "../../../styles/text";
import IncomeAndOutputPeriodsChart from "./Chart";
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
import IncomeAndSpendPeriodsLegend from "./Legend";

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
  height: 168px;
  gap: 24px;
  margin-top: 8px;
  @media screen and (max-width: 800px) {
    flex-direction: column;
  }
`;

const LegendWrapper = styled.div`
  margin-top: 16px;
`;

function useLegends() {
  const theme = useTheme();
  const colors = {
    Inflation: theme.pink500,
    Slashes: theme.pink400,
    Transfers: theme.pink300,
    "Big Others": theme.pink200,
    Proposals: theme.yellow500,
    Tips: theme.yellow400,
    Bounties: theme.yellow300,
    Burnt: theme.yellow200,
  };

  const [incomeLegends, setIncomeLegends] = useState([
    {
      label: "Inflation",
      color: colors["Inflation"],
      enabled: true,
      getValue: (period) => 0 - period.totalInflationValue,
    },
    {
      label: "Slashes",
      color: colors["Slashes"],
      enabled: true,
      getValue: (period) => 0 - period.totalSlashesValue,
    },
    {
      label: "Transfers",
      color: colors["Transfers"],
      enabled: true,
      getValue: (period) => 0 - period.totalTransfersValue,
    },
    {
      label: "Big Others",
      color: colors["Big Others"],
      enabled: true,
      getValue: (period) => 0 - period.totalBigOthersValue,
    },
  ]);
  const [outputLegends, setOutputLegends] = useState([
    {
      label: "Proposals",
      color: colors["Proposals"],
      enabled: true,
      getValue: (period) => period.totalProposalsValue,
      getCount: (period) => period.proposals.length,
      getFiat: (period) => period.totalProposalsFiat,
    },
    {
      label: "Tips",
      color: colors["Tips"],
      enabled: true,
      getValue: (period) => period.totalTipsValue,
      getCount: (period) => period.tips.length,
      getFiat: (period) => period.totalTipsFiat,
    },
    {
      label: "Bounties",
      color: colors["Bounties"],
      enabled: true,
      getValue: (period) => period.totalBountiesValue,
      getCount: (period) => period.bounties.length,
      getFiat: (period) => period.totalBountiesFiat,
    },
    {
      label: "Burnt",
      color: colors["Burnt"],
      enabled: true,
      getValue: (period) => period.totalBurntValue,
      getCount: (period) => period.burnt.length,
      getFiat: (period) => period.totalBurntFiat,
    },
  ]);

  useEffect(() => {
    setIncomeLegends((legends) =>
      legends.map((legend) => ({
        ...legend,
        color: colors[legend.label],
      })),
    );
    setOutputLegends((legends) =>
      legends.map((legend) => ({
        ...legend,
        color: colors[legend.label],
      })),
    );
  }, [theme]);

  return {
    incomeLegends,
    outputLegends,
    setIncomeLegends,
    setOutputLegends,
  };
}

export default function IncomeAndOutputPeriods() {
  const dispatch = useDispatch();
  const symbol = useSelector(chainSymbolSelector);
  const precision = getPrecision(symbol);
  const { incomeLegends, setIncomeLegends, outputLegends, setOutputLegends } =
    useLegends();
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

  const outputData = useMemo(() => {
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
      <Title>Income & Output Periods</Title>
      <LegendWrapper>
        <IncomeAndSpendPeriodsLegend
          incomeLegends={incomeLegends}
          setIncomeLegends={setIncomeLegends}
          outputLegends={outputLegends}
          setOutputLegends={setOutputLegends}
        />
      </LegendWrapper>
      <ContentWrapper>
        <IncomeAndOutputPeriodsChart
          incomePeriodsLegends={incomeLegends.filter((item) => item.enabled)}
          incomePeriodsData={incomeData}
          outputPeriodsLegends={outputLegends.filter((item) => item.enabled)}
          outputPeriodsData={outputData}
        />
      </ContentWrapper>
    </CardWrapper>
  );
}

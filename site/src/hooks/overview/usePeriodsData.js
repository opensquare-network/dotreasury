import { useMemo } from "react";
import { useSelector } from "react-redux";
import {
  incomePeriodsSelector,
  spendPeriodsSelector,
} from "../../store/reducers/overviewSlice";
import { chainSymbolSelector } from "../../store/reducers/chainSlice";
import { getPrecision, toPrecision } from "../../utils";
import { sum } from "../../utils/math";

export function useIncomePeriodsData() {
  const incomePeriods = useSelector(incomePeriodsSelector);
  const symbol = useSelector(chainSymbolSelector);
  const precision = getPrecision(symbol);

  return useMemo(() => {
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
}

export function useOutputPeriodsData() {
  const spendPeriods = useSelector(spendPeriodsSelector);
  const symbol = useSelector(chainSymbolSelector);
  const precision = getPrecision(symbol);

  return useMemo(() => {
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
}

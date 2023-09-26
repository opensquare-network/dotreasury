import sumBy from "lodash.sumby";
import {
  useOverviewIncomeChartData,
  useOverviewOutputChartData,
} from "./useChartData";

export function useOverviewTotalAmount(chain) {
  const { incomeData } = useOverviewIncomeChartData(chain);
  const { outputData } = useOverviewOutputChartData(chain);

  const totalIncome = sumBy(incomeData.labels, "value");
  const totalOutput = sumBy(outputData.labels, "value");

  return {
    totalIncome,
    totalOutput,
  };
}

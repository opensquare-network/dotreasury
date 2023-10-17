import dayjs from "dayjs";
import { useIncomePeriodsData, useOutputPeriodsData } from "./usePeriodsData";
import flatten from "lodash.flatten";

const categoryPercentage = 0.7;
const barPercentage = 0.8;

export function usePeriodsChartLabels() {
  const outputPeriodsData = useOutputPeriodsData();

  const labels = outputPeriodsData.map(
    (item) =>
      `${dayjs(item.startIndexer.blockTime).format("YYYY-MM-DD")} ~ ${dayjs(
        item.endIndexer.blockTime,
      ).format("YYYY-MM-DD")}`,
  );

  return labels;
}

export function useIncomePeriodsChartDatasets(incomePeriodsLegends = []) {
  const incomePeriodsData = useIncomePeriodsData();

  return incomePeriodsLegends
    .filter((i) => i.enabled)
    .map((legend) => {
      return {
        categoryPercentage,
        barPercentage,
        label: legend.label,
        data: incomePeriodsData.map(legend.getValue),
        backgroundColor: legend.color,
        stack: "period",
      };
    });
}

export function useOutputPeriodsChartDatasets(outputPeriodsLegends = []) {
  const outputPeriodsData = useOutputPeriodsData();

  return outputPeriodsLegends
    .filter((i) => i.enabled)
    .map((legend) => {
      return {
        categoryPercentage,
        barPercentage,
        label: legend.label,
        data: outputPeriodsData.map(legend.getValue),
        counts: outputPeriodsData.map(legend.getCount),
        fiats: outputPeriodsData.map(legend.getFiat),
        backgroundColor: legend.color,
        stack: "period",
      };
    });
}

export function usePeriodsDatasetsMaxValue(...datasets) {
  const values = flatten(datasets.map((i) => i.data));
  const max = Math.max(...values.map(Math.abs));

  return max;
}

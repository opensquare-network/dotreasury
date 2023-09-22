import Card from "../../../../../site/src/components/Card";
import { useTheme } from "../../../../../site/src/context/theme";
import { bnToBn } from "@polkadot/util";
import { toPrecision } from "../../../../../site/src/utils";
import { getChainSettings } from "../../../utils/chains";
import Chart from "../../../../../site/src/pages/Overview/TotalStacked/Chart";
import { useStatsHistory } from "../../../hooks/useData";

export default function OverviewTotalStacked({ chain = "" }) {
  const { decimals } = getChainSettings(chain);
  const statsHistory = useStatsHistory(chain);

  const dateLabels = statsHistory.map(
    (statsItem) => statsItem.indexer.blockTime,
  );

  const theme = useTheme();
  const chartRange = [0, dateLabels.length - 1];

  const incomeHistory = statsHistory
    .map((statsItem) =>
      bnToBn(statsItem.income.inflation)
        .add(bnToBn(statsItem.income.slash))
        .add(bnToBn(statsItem.income.transfer))
        .add(bnToBn(statsItem.income.others)),
    )
    .map((bn) => toPrecision(bn, decimals, false));
  const outputHistory = statsHistory
    .map((statsItem) =>
      bnToBn(statsItem.output.tip)
        .add(bnToBn(statsItem.output.proposal))
        .add(bnToBn(statsItem.output.bounty))
        .add(bnToBn(statsItem.output.burnt))
        .add(bnToBn(statsItem.output.transfer)),
    )
    .map((bn) => toPrecision(bn, decimals, false));
  const treasuryHistory = statsHistory.map((statsItem) =>
    toPrecision(statsItem.treasuryBalance, decimals, false),
  );

  const sliceRangeData = (data) => {
    return data.slice(chartRange[0], chartRange[1] + 1);
  };

  const chartData = {
    dates: sliceRangeData(dateLabels),
    values: [
      {
        label: "Income",
        primaryColor: theme.pink300,
        secondaryColor: theme.pink100,
        data: sliceRangeData(incomeHistory),
        fill: true,
        icon: "square",
        order: 2,
      },
      {
        label: "Output",
        primaryColor: theme.yellow300,
        secondaryColor: theme.yellow100,
        data: sliceRangeData(outputHistory),
        fill: true,
        icon: "square",
        order: 1,
      },
      {
        label: "Treasury",
        primaryColor: theme.orange300,
        secondaryColor: theme.orange300,
        data: sliceRangeData(treasuryHistory),
        fill: false,
        icon: "bar",
        order: 0,
      },
    ],
  };

  return (
    <Card className="!p-6 h-full space-y-6 max-md:!pb-12">
      <h4 className="h4-16-semibold">Total Stacked</h4>
      <div className="h-56">
        <Chart
          data={chartData}
          onHover={() => {}}
          stepSize={chain === "kusama" ? 200000 : 8000000}
        />
      </div>
    </Card>
  );
}

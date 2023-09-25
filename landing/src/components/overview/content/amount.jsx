import ExternalLink from "../../../../../site/src/components/ExternalLink";
import IconMask from "../../../../../site/src/components/Icon/Mask";
import DoughnutCard from "../../../../../site/src/pages/Overview/DoughnutCard";
import {
  useOverviewIncomeChartData,
  useOverviewOutputChartData,
} from "../../../hooks/overview/useChartData";
import { cn } from "../../../utils";
import { getChainSettings } from "../../../utils/chains";
import { useState } from "react";

export default function OverviewAmount({ chain = "" }) {
  const [view, setView] = useState("income");
  const { symbol } = getChainSettings(chain);
  const {
    incomeData,
    incomeStatus,
    clickEvent: incomeClickEvent,
  } = useOverviewIncomeChartData(chain);
  const {
    outputData,
    outputStatus,
    clickEvent: outputClickEvent,
  } = useOverviewOutputChartData(chain);

  const tabs = [
    {
      id: "income",
      label: "Income",
    },
    {
      id: "output",
      label: "Output",
    },
  ];

  const chartData = view === "income" ? incomeData : outputData;
  const chartStatus = view === "income" ? incomeStatus : outputStatus;
  const clickEvent = view === "income" ? incomeClickEvent : outputClickEvent;

  return (
    <DoughnutCard
      key={chain}
      className="!p-6 h-full"
      title={
        <div className="flex items-center space-x-4">
          {tabs.map((tab) => (
            <div key={tab.id} className="flex items-center">
              <h4
                className={cn(
                  "h4-16-semibold cursor-pointer",
                  "hover:text-textSecondary",
                  view === tab.id ? "text-textPrimary" : "text-textTertiary",
                )}
                onClick={() => setView(tab.id)}
              >
                {tab.label}
              </h4>

              <ExternalLink
                className={"inline-flex items-center"}
                href="https://wiki.polkadot.network/docs/learn-treasury#funding-the-treasury"
              >
                <IconMask
                  src="/imgs/caret-up-right.svg"
                  color="textTertiary"
                  size={16}
                  className="ml-1 hover:bg-textSecondary"
                />
              </ExternalLink>
            </div>
          ))}
        </div>
      }
      data={chartData}
      status={chartStatus}
      symbol={symbol}
      clickEvent={clickEvent}
    />
  );
}

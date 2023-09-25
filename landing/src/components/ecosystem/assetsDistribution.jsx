import Card from "../../../../site/src/components/Card";
import DoughnutChart from "../../../../site/src/components/CustomDoughnut";
import CustomLabelIcon from "../../../../site/src/pages/Overview/CustomLabel/icon";
import { abbreviateBigNumber } from "../../../../site/src/utils";
import { sum } from "../../../../site/src/utils/math";
import { useEcosystemAssetsDistributionData } from "../../hooks/ecosystem/useAssetsDistributionData";
import { cn } from "../../utils";

export default function EcosystemAssetsDistribution(props) {
  const { data, total, status, clickEvent } =
    useEcosystemAssetsDistributionData();

  return (
    <Card {...props} className={cn("!p-6", props.className)}>
      <h4 className="h3-18-semibold">Treasury Assets Distribution</h4>

      <div className="mt-6">
        <div className="p-6">
          <div className="mx-auto w-[216px] h-[216px] relative">
            <div className="w-[125px] text-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="h4-16-semibold">
                ≈ ${abbreviateBigNumber(total)}
              </div>
              <p className="text-textTertiary p-12-medium">
                Total Treasury Assets
              </p>
            </div>

            <DoughnutChart
              data={data}
              status={status}
              onTooltipLabel={(tooltipItem) => {
                const dataset = tooltipItem.dataset;
                const currentValue = tooltipItem.parsed;
                const total = sum(dataset.data);
                const percentage = parseFloat(
                  ((currentValue / total) * 100).toFixed(2),
                );
                return ` ≈ $${abbreviateBigNumber(
                  currentValue,
                )} (${percentage}%)`;
              }}
            />
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap justify-center gap-x-4 gap-y-2">
        {data.labels.map((item, idx) => {
          const disabled = status?.labels[idx]?.disabled;

          return (
            <div
              key={item.name}
              className="flex items-center"
              role="button"
              onClick={() => {
                clickEvent(item.name);
              }}
            >
              <div className="mr-1">
                <CustomLabelIcon
                  disabled={disabled}
                  icon={data.icon}
                  color={item.color}
                />
              </div>
              <div
                className={cn("p-14-medium", disabled && "text-textDisable")}
              >
                {item.name}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

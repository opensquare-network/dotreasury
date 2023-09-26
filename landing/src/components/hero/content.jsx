import { abbreviateBigNumber } from "@site/src/utils";
import { useTreasuriesData } from "../../hooks/useTreasuriesData";
import { cn } from "../../utils";
import CountUp from "react-countup";

export default function HeroContent() {
  const { data, totalValue } = useTreasuriesData();

  const projects = data.length || 0;

  const displayTotalValue = abbreviateBigNumber(totalValue);
  const displayTotalValueFiat = Number(displayTotalValue.slice(0, -1));
  const displayTotalValueDecimals = totalValue ? 2 : 0;
  const displayTotalValueUnit = totalValue ? displayTotalValue.slice(-1) : "";

  return (
    <div>
      <div className="h2-32-bold-montserrat text-textPrimary max-sm:leading-10">
        <div>
          <div
            className={cn(
              "text-yellow500",
              "sm:h2-48-bold-montserrat",
              !projects && "animate-pulse",
            )}
          >
            <CountUp end={projects} />
          </div>
          <div className="h2-32-bold-montserrat leading-[32px]">Projects</div>
        </div>
        <div className="mt-4">
          <div
            className={cn(
              "text-pink500 sm:h2-48-bold-montserrat",
              !totalValue && "animate-pulse",
            )}
          >
            <CountUp
              prefix="$"
              end={displayTotalValueFiat}
              decimals={displayTotalValueDecimals}
              suffix={displayTotalValueUnit}
            />
          </div>
          <div className="h2-32-bold-montserrat leading-[32px]">
            Treasury Assets
          </div>
        </div>
        <div className="mt-4 sm:h2-48-bold-montserrat inline-block max-sm:inline">
          In Polkadot Ecosystem
        </div>
      </div>

      <div className="text-textTertiary h3-18-medium sm:mt-2 mt-4">
        dotTreasury is a platform that aggregates treasury data in the polkadot ecosystem.
      </div>
    </div>
  );
}

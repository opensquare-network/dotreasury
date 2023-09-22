import { abbreviateBigNumber } from "../../../../site/src/utils";
import { useTreasuriesData } from "../../hooks/useTreasuriesData";
import { cn } from "../../utils";

export default function HeroContent() {
  const { data, totalValue } = useTreasuriesData();

  return (
    <div>
      <div className="h2-32-bold-montserrat text-textPrimary max-sm:leading-10">
        <div>
          <span className={cn("text-yellow500", "sm:h2-48-bold-montserrat")}>
            {data.length || 0}
          </span>{" "}
          <span>Projects</span>
        </div>
        <div>
          <span className="text-pink500 sm:h2-48-bold-montserrat">
            ${abbreviateBigNumber(totalValue)}
          </span>{" "}
          <span>Treasury Assets</span>{" "}
          <span className="sm:h2-48-bold-montserrat inline-block max-sm:inline">
            In Dotsama Ecosystem
          </span>
        </div>
      </div>

      <div className="text-textTertiary h3-18-medium sm:mt-2">
        dotTreasury is a platform that aggregates treasury data on the Substrate
        ecological network.
      </div>
    </div>
  );
}

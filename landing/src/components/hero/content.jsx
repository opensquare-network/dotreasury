import FooterFundedBy from "../../../../site/src/pages/Footer/FundedBy";
import { cn } from "../../utils";

export default function HeroContent() {
  return (
    <div>
      <div className="h2-32-bold-montserrat text-textPrimary max-sm:leading-10">
        <div>
          <span className={cn("text-yellow500", "sm:h2-48-bold-montserrat")}>
            8
          </span>{" "}
          <span>Projects</span>
        </div>
        <div>
          <span className="text-pink500 sm:h2-48-bold-montserrat">
            $320,12M
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

      <FooterFundedBy className="mt-10 p-16-medium flex gap-x-4 !text-textTertiary max-sm:!hidden" />
    </div>
  );
}
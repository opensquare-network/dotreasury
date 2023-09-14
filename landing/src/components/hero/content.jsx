import FooterFundedBy from "../../../../site/src/pages/Footer/FundedBy";

export default function HeroContent() {
  return (
    <div>
      <div>
        <div>
          <span className="text-yellow500 h2-48-bold-montserrat">8</span>{" "}
          <span className="h2-32-bold-montserrat">Projects</span>
        </div>
        <div>
          <span className="text-pink500 h2-48-bold-montserrat">$320,12M</span>{" "}
          <span className="h2-32-bold-montserrat">Treasury Assets</span>
        </div>
        <div className="h2-48-bold-montserrat">In Dotsama Ecosystem</div>
      </div>

      <div className="text-textTertiary h3-18-medium mt-2">
        dotTreasury is a platform that aggregates treasury data on the Substrate
        ecological network.
      </div>

      <FooterFundedBy className="mt-10 p-16-medium flex gap-x-4 !text-textTertiary" />
    </div>
  );
}

import { useState } from "react";
import Container from "../../../../site/src/components/Container";
import ImageWithDark from "../../../../site/src/components/ImageWithDark";
import Tabs from "../tabs";
import TreasuryOverviewContent from "./content";
import { CHAINS } from "../../utils/chains";

export default function TreasuryOverview() {
  const [activeTabId, setActiveTabId] = useState(CHAINS.polkadot.value);

  const tabs = [CHAINS.polkadot, CHAINS.kusama].map((chain) => {
    return {
      id: chain.value,
      label: (
        <span className="inline-flex gap-x-2">
          <ImageWithDark src={`/imgs/logo-${chain.value}.svg`} />
          <span className="h4-16-semibold">{chain.name}</span>
        </span>
      ),
      content: <TreasuryOverviewContent chain={activeTabId} />,
    };
  });

  return (
    <Container className="py-10">
      <h2 className="h2-32-bold-montserrat mb-10 px-6">
        Dotsama Treasury Overview
      </h2>
      <div>
        <Tabs
          tabs={tabs}
          activeTabId={activeTabId}
          onTabClick={(tab) => {
            setActiveTabId(tab.id);
          }}
        />
      </div>
    </Container>
  );
}
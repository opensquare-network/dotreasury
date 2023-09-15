import { useState } from "react";
import Container from "../../../../site/src/components/Container";
import ImageWithDark from "../../../../site/src/components/ImageWithDark";
import Tabs from "../tabs";
import TreasuryOverviewContent from "./content";

export default function TreasuryOverview() {
  const [activeTabId, setActiveTabId] = useState("polkadot");

  const tabs = [
    {
      id: "polkadot",
      label: (
        <span className="inline-flex gap-x-2">
          <ImageWithDark src="/imgs/logo-polkadot.svg" />
          <span className="h4-16-semibold">Polkadot</span>
        </span>
      ),
      content: <TreasuryOverviewContent />,
    },
    {
      id: "kusama",
      label: (
        <span className="inline-flex gap-x-2">
          <ImageWithDark src="/imgs/logo-kusama.svg" />
          <span className="h4-16-semibold">Kusama</span>
        </span>
      ),
      content: "kusama",
    },
  ];

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

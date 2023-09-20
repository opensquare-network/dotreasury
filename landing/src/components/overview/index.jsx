import { useState } from "react";
import Container from "../../../../site/src/components/Container";
import ImageWithDark from "../../../../site/src/components/ImageWithDark";
import Tabs from "../tabs";
import OverviewContent from "./content";
import { CHAINS } from "../../utils/chains";
import { cn } from "../../utils";
import { useConnectSocket } from "../../hooks/useConnectSocket";
import { useEffect } from "react";

export default function Overview() {
  const [activeTabId, setActiveTabId] = useState(CHAINS.polkadot.value);
  const connect = useConnectSocket();

  useEffect(() => {
    connect(CHAINS.kusama.value);
    connect(CHAINS.polkadot.value);
  }, []);

  const tabs = [CHAINS.polkadot, CHAINS.kusama].map((chain) => {
    return {
      id: chain.value,
      label: (
        <span className="inline-flex gap-x-2">
          <ImageWithDark src={`/imgs/logo-${chain.value}.svg`} />
          <span className="h4-16-semibold">{chain.name}</span>
        </span>
      ),
      content: <OverviewContent chain={activeTabId} />,
    };
  });

  return (
    <Container className="py-10">
      <h2
        className={cn(
          "h2-32-bold-montserrat mb-10 px-6",
          "max-md:h3-24-semibold",
        )}
      >
        Dotsama Treasury Overview
      </h2>
      <div>
        <Tabs
          tabsListClassName="max-md:px-6"
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

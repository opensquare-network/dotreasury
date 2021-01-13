import React, { useState, useEffect } from "react";
import styled from "styled-components";

import ImageButton from "./ImageButton";
import ExplorerLink from "../../components/ExplorerLink";
import ExternalLink from "../../components/ExternalLink";
import { nil } from "../../utils";

const Wrapper = styled.div`
  margin-top: 8px;
  display: flex;
  gap: 8px;
`;

const ButtonList = ({ extrinsicIndexer, eventIndexer, polkassembly }) => {
  const [motionUrl, setMotionUrl] = useState(null);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      if (polkassembly) {
        const url = await polkassembly;
        if (isMounted) {
          setMotionUrl(url);
        }
      }
    })();
    return () => {
      isMounted = false;
    }
  }, [polkassembly]);

  const blockHeight = extrinsicIndexer?.blockHeight ?? eventIndexer?.blockHeight;
  const extrinsicIndex = extrinsicIndexer?.index ?? 0;
  const eventSort = eventIndexer?.eventSort;

  return (
    <Wrapper>
      <ExplorerLink base="https://polkascan.io/kusama/" href={`${nil(eventSort) ? "transaction" : "event"}/${blockHeight}-${eventSort ?? extrinsicIndex}`}>
        <ImageButton src={"/imgs/polkascan-logo.svg"} />
      </ExplorerLink>
      <ExplorerLink base="https://kusama.subscan.io/" href={`extrinsic/${blockHeight}-${extrinsicIndex}${nil(eventSort) ? "" : "?event=" + blockHeight + "-" + eventSort }`}>
        <ImageButton src={"/imgs/subscan-logo.svg"} />
      </ExplorerLink>
      { motionUrl && (
          <ExternalLink href={motionUrl}>
            <ImageButton src={"/imgs/polkassembly-logo.svg"} />
          </ExternalLink>
        ) }
    </Wrapper>
  );
};

export default ButtonList;

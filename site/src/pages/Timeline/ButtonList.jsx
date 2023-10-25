import React, { useEffect, useState } from "react";
import styled from "styled-components";

import ImageButton from "./ImageButton";
import ExplorerLink from "../../components/ExplorerLink";
import ExternalLink from "../../components/ExternalLink";
import { useIsMounted } from "@osn/common";
import { useSelector } from "react-redux";
import { chainSelector } from "../../store/reducers/chainSlice";
import { TimelineItemType } from "../../constants";
import { currentChainSettings } from "../../utils/chains";

const Wrapper = styled.div`
  margin-top: 8px;
  display: flex;
  gap: 8px;
`;

const ButtonList = ({ extrinsicIndexer, eventIndexer, polkassembly, type }) => {
  const [subsquareUrl, setSubsquareUrl] = useState(null);
  const isMounted = useIsMounted();
  const chain = useSelector(chainSelector);

  useEffect(() => {
    (async () => {
      if (polkassembly === undefined || !type) return;

      if (type === TimelineItemType.CouncilMotion) {
        setSubsquareUrl(
          `https://${chain}.subsquare.io/council/motion/${polkassembly}`,
        );
      }

      if (type === TimelineItemType.DemocracyReferendum) {
        setSubsquareUrl(
          `https://${chain}.subsquare.io/democracy/referendum/${polkassembly}`,
        );
      }

      if (type === TimelineItemType.Gov2Referendum) {
        setSubsquareUrl(
          `https://${chain}.subsquare.io/referenda/referendum/${polkassembly}`,
        );
      }
    })();
  }, [polkassembly, type, chain, isMounted]);

  const blockHeight = (extrinsicIndexer || eventIndexer)?.blockHeight;
  const extrinsicIndex =
    (extrinsicIndexer || eventIndexer)?.extrinsicIndex || 0;
  const eventSort = eventIndexer?.eventIndex;

  const isExtrinsic = !!extrinsicIndexer;
  const subscanLink = isExtrinsic
    ? `extrinsic/${blockHeight}-${extrinsicIndex}`
    : `extrinsic/${blockHeight}-${extrinsicIndex}?event=${blockHeight}-${eventSort}`;

  return (
    <Wrapper>
      {currentChainSettings.hasPolkascan && (
        <ExplorerLink
          base={`https://polkascan.io/${currentChainSettings.value}/`}
          href={`${isExtrinsic ? "transaction" : "event"}/${blockHeight}-${
            isExtrinsic ? extrinsicIndex : eventSort
          }`}
        >
          <ImageButton src={"/imgs/polkascan-logo.svg"} />
        </ExplorerLink>
      )}
      {currentChainSettings.hasSubscan && (
        <ExplorerLink
          base={`https://${currentChainSettings.value}.subscan.io/`}
          href={subscanLink}
        >
          <ImageButton src={"/imgs/subscan-logo.svg"} />
        </ExplorerLink>
      )}
      {subsquareUrl && (
        <ExternalLink href={subsquareUrl}>
          <ImageButton src={"/imgs/subsquare-logo.svg"} />
        </ExternalLink>
      )}
    </Wrapper>
  );
};

export default ButtonList;

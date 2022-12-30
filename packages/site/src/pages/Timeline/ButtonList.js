import React, { useEffect, useState } from "react";
import styled, { css } from "styled-components";

import ImageButton from "./ImageButton";
import ExplorerLink from "../../components/ExplorerLink";
import ExternalLink from "../../components/ExternalLink";
import { useIsMounted } from "../../utils/hooks";
import { mrgap } from "../../styles";
import polkassemblyApi from "../../services/polkassembly";
import { useSelector } from "react-redux";
import { chainSelector } from "../../store/reducers/chainSlice";
import { TimelineItemType } from "../../constants";

const Wrapper = styled.div`
  margin-top: 8px;
  display: flex;
  ${css`
    ${mrgap("8px")}
  `}
`;

const ButtonList = ({ extrinsicIndexer, eventIndexer, polkassembly, type }) => {
  const [polkassemblyUrl, setPolkassemblyUrl] = useState(null);
  const [subsquareUrl, setSubsquareUrl] = useState(null);
  const isMounted = useIsMounted();
  const chain = useSelector(chainSelector);

  useEffect(() => {
    (async () => {
      if (polkassembly === undefined || !type) return;

      if (type === TimelineItemType.CouncilMotion) {
        setSubsquareUrl(`https://${chain}.subsquare.io/council/motion/${polkassembly}`);
        const url = await polkassemblyApi.getMotionUrl(polkassembly);
        if (isMounted.current) {
          setPolkassemblyUrl(url);
        }
      }

      if (type === TimelineItemType.DemocracyReferendum) {
        setSubsquareUrl(`https://${chain}.subsquare.io/democracy/referendum/${polkassembly}`);
        const url = await polkassemblyApi.getReferendumUrl(polkassembly);
        if (isMounted.current) {
          setPolkassemblyUrl(url);
        }
      }

      if (type === TimelineItemType.Gov2Referendum) {
        setSubsquareUrl(`https://${chain}.subsquare.io/referenda/referendum/${polkassembly}`);
        const url = await polkassemblyApi.getGov2ReferendumUrl(polkassembly);
        if (isMounted.current) {
          setPolkassemblyUrl(url);
        }
      }
    })();
  }, [polkassembly, type, chain, isMounted]);

  const blockHeight = (extrinsicIndexer || eventIndexer)?.blockHeight;
  const extrinsicIndex = (extrinsicIndexer || eventIndexer)?.extrinsicIndex || 0;
  const eventSort = eventIndexer?.eventIndex;

  const isExtrinsic = !!extrinsicIndexer;
  const subscanLink = isExtrinsic
    ? `extrinsic/${blockHeight}-${extrinsicIndex}`
    : `extrinsic/${blockHeight}-${extrinsicIndex}?event=${blockHeight}-${eventSort}`;

  return (
    <Wrapper>
      <ExplorerLink
        base={
          chain === "kusama"
            ? "https://polkascan.io/kusama/"
            : "https://polkascan.io/polkadot/"
        }
        href={`${isExtrinsic ? "transaction" : "event"}/${blockHeight}-${
          isExtrinsic ? extrinsicIndex : eventSort
        }`}
      >
        <ImageButton src={"/imgs/polkascan-logo.svg"} />
      </ExplorerLink>
      <ExplorerLink
        base={
          chain === "kusama"
            ? "https://kusama.subscan.io/"
            : "https://polkadot.subscan.io/"
        }
        href={subscanLink}
      >
        <ImageButton src={"/imgs/subscan-logo.svg"} />
      </ExplorerLink>
      {polkassemblyUrl && (
        <ExternalLink href={polkassemblyUrl}>
          <ImageButton src={"/imgs/polkassembly-logo.svg"} />
        </ExternalLink>
      )}
      {subsquareUrl && (
        <ExternalLink href={subsquareUrl}>
          <ImageButton src={"/imgs/timeline-subsquare-link.svg"} />
        </ExternalLink>
      )}
    </Wrapper>
  );
};

export default ButtonList;

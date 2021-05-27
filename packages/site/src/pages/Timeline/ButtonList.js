import React, { useState, useEffect } from "react";
import styled, { css } from "styled-components";

import ImageButton from "./ImageButton";
import ExplorerLink from "../../components/ExplorerLink";
import ExternalLink from "../../components/ExternalLink";
import { nil } from "../../utils";
import { useIsMounted } from "../../utils/hooks";
import { mrgap } from "../../styles";
import polkassemblyApi from "../../services/polkassembly";
import { useSelector } from "react-redux";
import { chainSelector } from "../../store/reducers/chainSlice";

const Wrapper = styled.div`
  margin-top: 8px;
  display: flex;
  ${css`
    ${mrgap("8px")}
  `}
`;

const ButtonList = ({ extrinsicIndexer, eventIndexer, polkassembly }) => {
  const [motionUrl, setMotionUrl] = useState(null);
  const isMounted = useIsMounted();
  const chain = useSelector(chainSelector);

  useEffect(() => {
    (async () => {
      if (polkassembly !== undefined) {
        const url = await polkassemblyApi.getMotionUrl(polkassembly);
        if (isMounted.current) {
          setMotionUrl(url);
        }
      }
    })();
  }, [polkassembly, isMounted]);

  const blockHeight =
    extrinsicIndexer?.blockHeight ?? eventIndexer?.blockHeight;
  const extrinsicIndex = extrinsicIndexer?.index ?? 0;
  const eventSort = eventIndexer?.eventSort;

  return (
    <Wrapper>
      <ExplorerLink
        base={
          chain === "kusama"
            ? "https://polkascan.io/kusama/"
            : "https://polkascan.io/polkadot/"
        }
        href={`${nil(eventSort) ? "transaction" : "event"}/${blockHeight}-${
          eventSort ?? extrinsicIndex
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
        href={`extrinsic/${blockHeight}-${extrinsicIndex}${
          nil(eventSort) ? "" : "?event=" + blockHeight + "-" + eventSort
        }`}
      >
        <ImageButton src={"/imgs/subscan-logo.svg"} />
      </ExplorerLink>
      {motionUrl && (
        <ExternalLink href={motionUrl}>
          <ImageButton src={"/imgs/polkassembly-logo.svg"} />
        </ExternalLink>
      )}
    </Wrapper>
  );
};

export default ButtonList;

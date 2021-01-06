import React from "react";
import styled from "styled-components";

import ImageButton from "./ImageButton";
import ExplorerLink from "../../components/ExplorerLink";
import ExternalLink from "../../components/ExternalLink";

const Wrapper = styled.div`
  margin-top: 8px;
  display: flex;
  gap: 8px;
`;

const ButtonList = ({ indexer, polkassembly }) => {
  return (
    <Wrapper>
      <ExplorerLink base="https://polkascan.io/kusama/" href={`transaction/${indexer.blockHeight}-${indexer.index}`}>
        <ImageButton src={"/imgs/polkascan-logo.svg"} />
      </ExplorerLink>
      <ExplorerLink base="https://kusama.subscan.io/" href={`extrinsic/${indexer.blockHeight}-${indexer.index}`}>
        <ImageButton src={"/imgs/subscan-logo.svg"} />
      </ExplorerLink>
      { polkassembly && (
          <ExternalLink href={polkassembly}>
            <ImageButton src={"/imgs/polkassembly-logo.svg"} />
          </ExternalLink>
        ) }
    </Wrapper>
  );
};

export default ButtonList;

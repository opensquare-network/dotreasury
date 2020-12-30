import React from "react";
import styled from "styled-components";

import ImageButton from "./ImageButton";
import ExplorerLink from "../../components/ExplorerLink";

const Wrapper = styled.div`
  margin-top: 8px;
  display: flex;
  gap: 8px;
`;

const ButtonList = ({ indexer }) => {
  return (
    <Wrapper>
      <ExplorerLink base="https://polkascan.io/kusama/" href={`transaction/${indexer.blockHeight}-${indexer.index}`}>
        <ImageButton src={"/imgs/polkascan-logo.png"} />
      </ExplorerLink>
      <ExplorerLink base="https://kusama.subscan.io/" href={`extrinsic/${indexer.blockHeight}-${indexer.index}`}>
        <ImageButton src={"/imgs/subscan-logo.png"} />
      </ExplorerLink>
      <ImageButton src={"/imgs/polkassembly-logo.png"} />
    </Wrapper>
  );
};

export default ButtonList;

import React from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { Image } from "semantic-ui-react";
import ExplorerLink from "../../components/ExplorerLink";
import Setting from "./Setting";

import { TEXT_DARK_MAJOR, TEXT_DARK_MINOR } from "../../constants";
import {
  chainSelector,
  scanHeightSelector,
} from "../../store/reducers/chainSlice";

const Wrapper = styled.div`
  display: flex;
  align-items: center;

  background: #fbfbfb;
  padding: 2px 16px;
`;

const Label = styled.div`
  font-family: "Inter";
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  line-height: 24px;
`;

const DarkMinorLabel = styled(Label)`
  color: ${TEXT_DARK_MINOR};
  margin-right: 8px;
  @media screen and (max-width: 640px) {
    display: none;
  }
`;

const DarkMajorLabel = styled(Label)`
  color: ${TEXT_DARK_MAJOR};
  margin-right: 16px;
  &:hover {
    text-decoration-line: underline;
  }
`;

const Kusama = styled(Image)`
  position: relative;
  top: -1px;
  margin-right: 8px;
`;

const ScanHeight = () => {
  const scanHeight = useSelector(scanHeightSelector);
  const chain = useSelector(chainSelector);

  return (
    <Wrapper>
      <Kusama
        src={
          chain === "polkadot"
            ? "/imgs/logo-polkadot.svg"
            : "/imgs/logo-kusama.svg"
        }
      />
      <DarkMinorLabel>Scan height</DarkMinorLabel>
      <ExplorerLink href={`/block/${scanHeight}`}>
        <DarkMajorLabel>{`#${scanHeight}`}</DarkMajorLabel>
      </ExplorerLink>
      <Setting />
    </Wrapper>
  );
};

export default ScanHeight;

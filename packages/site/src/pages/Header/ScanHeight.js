import React from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { Image } from "semantic-ui-react";
import ExplorerLink from "../../components/ExplorerLink";
import Setting from "../../components/Setting";

import { TEXT_DARK_MAJOR, TEXT_DARK_MINOR } from "../../constants";
import {
  chainSelector,
  scanHeightSelector,
} from "../../store/reducers/chainSlice";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  margin-right: 21px;
`;

const ScanHeightWrapper = styled.div`
  display: flex;
  align-items: center;

  background: #fbfbfb;
  height: 32px;
  padding: 4px;
  margin-right: 4px;
`;

const SettingWrapper = styled.div`
  background: #fbfbfb;
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
  margin-left: 8px;
  margin-right: 8px;
  @media screen and (max-width: 640px) {
    display: none;
  }
`;

const DarkMajorLabel = styled(Label)`
  margin-right: 4px;
  color: ${TEXT_DARK_MAJOR};
  &:hover {
    text-decoration-line: underline;
  }
  @media screen and (max-width: 640px) {
    display: none;
  }
`;

const Kusama = styled(Image)`
  position: relative;
  top: -1px;
`;

const ScanHeight = () => {
  const scanHeight = useSelector(scanHeightSelector);
  const chain = useSelector(chainSelector);

  return (
    <Wrapper>
      <ScanHeightWrapper>
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
      </ScanHeightWrapper>
      <SettingWrapper>
        <Setting />
      </SettingWrapper>
    </Wrapper>
  );
};

export default ScanHeight;

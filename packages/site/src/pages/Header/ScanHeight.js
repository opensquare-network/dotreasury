import React, { useState } from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { Image } from "semantic-ui-react";
import ExplorerLink from "../../components/ExplorerLink";
import Card from "../../components/Card";

import { TEXT_DARK_MAJOR, TEXT_DARK_MINOR } from "../../constants";
import {
  chainSelector,
  scanHeightSelector,
} from "../../store/reducers/chainSlice";
import {
  currentNodeSelector,
  setCurrentNode,
} from "../../store/reducers/nodeSlice";

const Wrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  border: 1px solid #f4f4f4;
  border-radius: 4px;
`;

const ScanHeightWrapper = styled.div`
  display: flex;
  align-items: center;

  background: #fbfbfb;
  height: 32px;
  padding: 4px 8px;
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

const Button = styled.button`
  padding: 4px;
  border: none;
  border-left: 1px solid #f4f4f4;
  cursor: pointer;
  background: #fff;
`;

const SymbolWrapper = styled(Card)`
  position: absolute;
  padding: 4px 0;
  left: 0;
  top: calc(100% + 8px);
  width: 100%;
  z-index: 999;
`;

const SymbolItem = styled.div`
  padding: 8px 16px;
  display: flex;
  align-items: center;
  font-size: 13px;
  line-height: 18px;
  color: ${TEXT_DARK_MAJOR};
  cursor: pointer;
  > img {
    margin-right: 8px;
  }
  > div:last-child {
    color: rgba(0, 0, 0, 0.15) !important;
    margin-left: auto;
  }
  :hover {
    background: #fafafa;
  }
`;

const ScanHeight = () => {
  const dispatch = useDispatch();
  const scanHeight = useSelector(scanHeightSelector);
  const chain = useSelector(chainSelector);
  const currentNodeSetting = useSelector(currentNodeSelector);
  const [symbolOpen, setSymbolOpen] = useState(false);

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
        <DarkMinorLabel>Height</DarkMinorLabel>
        <ExplorerLink href={`/block/${scanHeight}`}>
          <DarkMajorLabel>{`#${scanHeight}`}</DarkMajorLabel>
        </ExplorerLink>
      </ScanHeightWrapper>
      <Button
        onClick={() => {
          setSymbolOpen(!symbolOpen);
        }}
        onBlur={() => {
          setTimeout(() => {
            setSymbolOpen(false);
          }, 100);
        }}
      >
        <Image src="/imgs/icon-triangle-down.svg" />
      </Button>
      {symbolOpen && (
        <SymbolWrapper>
          <SymbolItem
            onClick={() => {
              dispatch(
                setCurrentNode({
                  chain: "polkadot",
                  url: currentNodeSetting.polkadot,
                })
              );
            }}
          >
            <Image src="/imgs/logo-polkadot.svg" />
            <div>Polkadot</div>
            <div className="unit">DOT</div>
          </SymbolItem>
          <SymbolItem
            onClick={() => {
              dispatch(
                setCurrentNode({
                  chain: "kusama",
                  url: currentNodeSetting.kusama,
                })
              );
            }}
          >
            <Image src="/imgs/logo-kusama.svg" />
            <div>Kusama</div>
            <div className="unit">KSM</div>
          </SymbolItem>
        </SymbolWrapper>
      )}
    </Wrapper>
  );
};

export default ScanHeight;

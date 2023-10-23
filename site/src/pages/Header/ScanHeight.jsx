import React, { useState, useRef } from "react";
import styled, { css } from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import Card from "../../components/Card";

import {
  chainSelector,
  scanHeightSelector,
} from "../../store/reducers/chainSlice";
import {
  currentNodeSelector,
  setCurrentNode,
  nodesSelector,
} from "../../store/reducers/nodeSlice";
import useUpdateNodesDelay from "../../utils/useUpdateNodesDelay";
import { addToast } from "../../store/reducers/toastSlice";
import ExternalLink from "../../components/ExternalLink";
import { useOnClickOutside } from "@osn/common";
import IconMask from "../../components/Icon/Mask";
import { inline_flex, items_center } from "../../styles/tailwindcss";
import ImageWithDark from "../../components/ImageWithDark";
import { CHAINS, CHAIN_SETTINGS } from "../../utils/chains";

const Wrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  background-color: var(--neutral100);
  border: 1px solid var(--neutral400);
  border-radius: 4px;
  min-width: 200px;
  @media screen and (max-width: 600px) {
    min-width: 65px;
    position: static;
  }
  :hover {
    background-color: var(--neutral300);
  }
  ${(p) =>
    p.isActive &&
    css`
      background-color: var(--neutral300);
    `}
`;

const ScanHeightWrapper = styled.div`
  display: flex;
  align-items: center;
  flex: 1 1 auto;
  height: 32px;
  padding: 4px 8px;
  padding-right: 0;
  cursor: pointer;
  div.blockHeight {
    padding-right: 8px;
    display: flex;
    flex-grow: 1;
  }
`;

const Label = styled.div`
  font-family: "Inter", sans-serif;
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  line-height: 24px;
`;

const DarkMinorLabel = styled(Label)`
  color: var(--textSecondary);
  margin-left: 8px;
  margin-right: 8px;
  @media screen and (max-width: 600px) {
    display: none;
  }
`;

const DarkMajorLabel = styled(Label)`
  margin-right: 4px;
  color: var(--textPrimary);
  @media screen and (max-width: 600px) {
    display: none;
  }
`;

const Button = styled.button`
  padding: 4px;
  border: none;
  border-left: 1px solid var(--neutral300);
  cursor: pointer;
  background-color: transparent;
  flex: 0 0 auto;
  ${inline_flex};
  ${items_center};
`;

const SymbolWrapper = styled(Card)`
  position: absolute;
  padding: 4px 0;
  left: 0;
  top: calc(100% + 8px);
  width: 100%;
  z-index: 999;
  @media screen and (max-width: 600px) {
    width: 100vw;
    left: 0;
    top: 100%;
    border-radius: 0;
    padding: 8px 0;
  }
`;

const SymbolItem = styled.div`
  padding: 8px 16px;
  display: flex;
  align-items: center;
  font-size: 13px;
  line-height: 18px;
  color: var(--textPrimary);
  cursor: pointer;
  > img {
    margin-right: 8px;
  }
  > div:last-child {
    color: var(--textDisable) !important;
    margin-left: auto;
  }
  :hover {
    background-color: var(--neutral300);
  }
  @media screen and (max-width: 600px) {
    padding: 11px 24px;
  }
  ${(p) =>
    p.isActive &&
    css`
      background-color: var(--neutral300);
    `}
`;

const NetworkWrapper = styled.div`
  position: relative;
  display: flex;
  @media screen and (max-width: 600px) {
    position: static;
  }
`;

const NodeButton = styled.button`
  flex: 0 0 auto;
  border: 1px solid var(--neutral400);
  border-radius: 4px;
  background-color: var(--neutral100);
  margin-left: 8px;
  padding: 4px;
  cursor: pointer;
  :hover {
    background-color: var(--neutral300);
  }
  ${(p) =>
    p.isActive &&
    css`
      background-color: var(--neutral300);
    `}
`;

const NodeItemWrapper = styled(Card)`
  position: absolute;
  padding: 4px 0;
  left: 0;
  top: calc(100% + 8px);
  width: 100%;
  z-index: 999;
  @media screen and (max-width: 600px) {
    width: 100vw;
    left: 0;
    top: 100%;
    border-radius: 0;
    padding: 8px 0;
  }
`;

const NodeItem = styled.div`
  padding: 8px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 13px;
  line-height: 18px;
  color: var(--textPrimary);
  :hover {
    background: var(--neutral300);
  }
  ${(p) =>
    p.isActive &&
    css`
      background: var(--neutral300);
    `}
  ${(p) =>
    p.delay &&
    typeof p.delay === "number" &&
    p.delay >= 0 &&
    css`
      > .delay {
        color: var(--green500);
      }
    `}
  ${(p) =>
    p.delay &&
    typeof p.delay === "number" &&
    p.delay >= 100 &&
    css`
      > .delay {
        color: var(--yellow500);
      }
    `}
  ${(p) =>
    p.delay &&
    typeof p.delay === "number" &&
    p.delay >= 300 &&
    css`
      > .delay {
        color: var(--red500);
      }
    `}
  @media screen and (max-width: 600px) {
    padding: 11px 24px;
  }
`;

const ScanHeight = () => {
  useUpdateNodesDelay();
  const dispatch = useDispatch();
  const scanHeight = useSelector(scanHeightSelector);
  const chain = useSelector(chainSelector);
  const currentNode = useSelector(currentNodeSelector);
  const nodesSetting = useSelector(nodesSelector);
  const [symbolOpen, setSymbolOpen] = useState(false);
  const [nodeOpen, setNodeOpen] = useState(false);
  const symbolRef = useRef(null);
  const netWorkRef = useRef(null);

  const supportedDotreasuryChains = Object.values(CHAINS).filter(
    (chain) => chain.hasDotreasury,
  );

  const currentNetwork = (nodesSetting || []).find(
    (item) => item.url === currentNode,
  );
  let currentNetworkImg = "/imgs/node-signal-unavailable.svg";
  if (currentNetwork && currentNetwork.delay) {
    if (currentNetwork.delay >= 300) {
      currentNetworkImg = "/imgs/node-signal-slow.svg";
    } else if (currentNetwork.delay >= 100) {
      currentNetworkImg = "/imgs/node-signal-medium.svg";
    } else if (currentNetwork.delay >= 0) {
      currentNetworkImg = "/imgs/node-signal-fast.svg";
    }
  }

  useOnClickOutside(symbolRef, () => {
    setSymbolOpen(false);
  });
  useOnClickOutside(netWorkRef, () => {
    setNodeOpen(false);
  });

  const switchNetwork = (node) => {
    if (node === chain) {
      return;
    }
    window.location.href = `https://${node}.dotreasury.com/`;
  };

  const switchNode = (url) => {
    if (url && url === currentNetwork?.url) return;
    dispatch(
      setCurrentNode({
        chain,
        url,
      }),
    );
    const nodeName = (nodesSetting || []).find(
      (item) => item.url === url,
    )?.name;
    dispatch(
      addToast({
        type: "success",
        message: `Node switched to ${nodeName}!`,
      }),
    );
  };

  return (
    <NetworkWrapper>
      <Wrapper isActive={symbolOpen}>
        <ScanHeightWrapper
          onClick={() => {
            setSymbolOpen(!symbolOpen);
          }}
          ref={symbolRef}
        >
          <div className="blockHeight">
            <ImageWithDark src={`/imgs/logo-${CHAIN_SETTINGS.value}.svg`} />
            <DarkMinorLabel>Height</DarkMinorLabel>
            <DarkMajorLabel>{`#${scanHeight.toLocaleString()}`}</DarkMajorLabel>
          </div>
          <Button isActive={symbolOpen}>
            <IconMask
              src={`${
                symbolOpen
                  ? "/imgs/icon-triangle-up.svg"
                  : "/imgs/icon-triangle-down.svg"
              }`}
              size={24}
              color="textSecondary"
            />
            {symbolOpen && (
              <SymbolWrapper>
                {supportedDotreasuryChains.map((item) => (
                  <SymbolItem
                    key={item.value}
                    isActive={chain === item.value}
                    onClick={() => {
                      switchNetwork(item.value);
                    }}
                  >
                    <ImageWithDark src={`/imgs/logo-${item.value}.svg`} />
                    <div>{item.name}</div>
                    <div className="unit">{item.symbol}</div>
                  </SymbolItem>
                ))}
                <ExternalLink href="https://edg.dotreasury.com/">
                  <SymbolItem onClick={() => setNodeOpen(false)}>
                    <ImageWithDark src="/imgs/logo-edgeware.svg" />
                    <div>Edgeware</div>
                    <div className="unit">EDG</div>
                  </SymbolItem>
                </ExternalLink>
              </SymbolWrapper>
            )}
          </Button>
        </ScanHeightWrapper>
      </Wrapper>
      <NodeButton
        isActive={nodeOpen}
        ref={netWorkRef}
        onClick={() => {
          setNodeOpen(!nodeOpen);
        }}
      >
        <ImageWithDark src={currentNetworkImg} />
        {nodeOpen && (
          <NodeItemWrapper>
            {(nodesSetting || []).map((item, index) => (
              <NodeItem
                key={index}
                delay={item.delay}
                onClick={() => switchNode(item.url)}
                isActive={item.name === currentNetwork?.name}
              >
                <div>Hosted by {item.name}</div>
                {item.delay !== null &&
                  item.delay !== undefined &&
                  !isNaN(item.delay) && (
                    <div className="delay">{item.delay} ms</div>
                  )}
              </NodeItem>
            ))}
          </NodeItemWrapper>
        )}
      </NodeButton>
    </NetworkWrapper>
  );
};

export default ScanHeight;

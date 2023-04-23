import React, { useState, useRef } from "react";
import styled, { css } from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import Image from "../../components/Image";
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

const Kusama = styled(Image)`
  position: relative;
  top: -1px;
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

const NetworkButton = styled.button`
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

const NetworkItemWrapper = styled(Card)`
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

const NetworkItem = styled.div`
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
  const currentNodeSetting = useSelector(currentNodeSelector);
  const nodesSetting = useSelector(nodesSelector);
  const [symbolOpen, setSymbolOpen] = useState(false);
  const [networkOpen, setNetorkOpen] = useState(false);
  const symbolRef = useRef(null);
  const netWorkRef = useRef(null);

  const currentNetwork = nodesSetting?.[chain]?.find(
    (item) => item.url === currentNodeSetting?.[chain],
  );
  let currentNetworkImg = "/imgs/node-signal-disabled.svg";
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
    setNetorkOpen(false);
  });

  const switchNode = (node) => {
    if (node === chain) return;
    dispatch(
      setCurrentNode({
        chain: node,
        url: currentNodeSetting.polkadot,
        refresh: true,
      }),
    );
  };
  const switchNetwork = (url) => {
    if (url && url === currentNetwork?.url) return;
    dispatch(
      setCurrentNode({
        chain,
        url,
      }),
    );
    const nodeName = nodesSetting[chain].find((item) => item.url === url)?.name;
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
            <Kusama
              src={
                chain === "polkadot"
                  ? "/imgs/logo-polkadot.svg"
                  : "/imgs/logo-kusama.svg"
              }
              dark
            />
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
                <SymbolItem
                  isActive={chain === "polkadot"}
                  onClick={() => {
                    switchNode("polkadot");
                  }}
                >
                  <Image src="/imgs/logo-polkadot.svg" dark />
                  <div>Polkadot</div>
                  <div className="unit">DOT</div>
                </SymbolItem>
                <SymbolItem
                  isActive={chain === "kusama"}
                  onClick={() => {
                    switchNode("kusama");
                  }}
                >
                  <Image src="/imgs/logo-kusama.svg" dark />
                  <div>Kusama</div>
                  <div className="unit">KSM</div>
                </SymbolItem>
                <ExternalLink href="https://edg.dotreasury.com/">
                  <SymbolItem onClick={() => setNetorkOpen(false)}>
                    <Image src="/imgs/logo-edgeware.svg" dark />
                    <div>Edgeware</div>
                    <div className="unit">EDG</div>
                  </SymbolItem>
                </ExternalLink>
              </SymbolWrapper>
            )}
          </Button>
        </ScanHeightWrapper>
      </Wrapper>
      <NetworkButton
        isActive={networkOpen}
        ref={netWorkRef}
        onClick={() => {
          setNetorkOpen(!networkOpen);
        }}
      >
        <Image src={currentNetworkImg} />
        {networkOpen && (
          <NetworkItemWrapper>
            {(nodesSetting?.[chain] || []).map((item, index) => (
              <NetworkItem
                key={index}
                delay={item.delay}
                onClick={() => switchNetwork(item.url)}
                isActive={item.name === currentNetwork?.name}
              >
                <div>Hosted by {item.name}</div>
                {item.delay !== null &&
                  item.delay !== undefined &&
                  !isNaN(item.delay) && (
                    <div className="delay">{item.delay} ms</div>
                  )}
              </NetworkItem>
            ))}
          </NetworkItemWrapper>
        )}
      </NetworkButton>
    </NetworkWrapper>
  );
};

export default ScanHeight;

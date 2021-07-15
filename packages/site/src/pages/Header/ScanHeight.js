import React, { useState, useRef } from "react";
import styled, { css } from "styled-components";
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
  nodesSelector,
} from "../../store/reducers/nodeSlice";
import { useOutsideClick } from "../../utils/hooks";
import useUpdateNodesDelay from "../../utils/useUpdateNodesDelay";
import { addToast } from "../../store/reducers/toastSlice";

const Wrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  border: 1px solid #f4f4f4;
  border-radius: 4px;
  min-width: 200px;
  @media screen and (max-width: 600px) {
    min-width: 65px;
    position: static;
  }
`;

const ScanHeightWrapper = styled.div`
  display: flex;
  align-items: center;
  flex: 1 1 auto;
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
  @media screen and (max-width: 600px) {
    display: none;
  }
`;

const DarkMajorLabel = styled(Label)`
  margin-right: 4px;
  color: ${TEXT_DARK_MAJOR};
  &:hover {
    text-decoration-line: underline;
  }
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
  border-left: 1px solid #f4f4f4;
  cursor: pointer;
  background: #fff;
  flex: 0 0 auto;
  :hover {
    background: #fafafa;
  }
  ${(p) =>
    p.isActive &&
    css`
      background: #fafafa;
    `}
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
  ${(p) =>
    p.isActive &&
    css`
      background: #fafafa;
    `}
  @media screen and (max-width: 600px) {
    padding: 11px 24px;
  }
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
  border: 1px solid #f4f4f4;
  border-radius: 4px;
  background-color: #fff;
  margin-left: 8px;
  padding: 4px;
  cursor: pointer;
  :hover {
    background: #fafafa;
  }
  ${(p) =>
    p.isActive &&
    css`
      background: #fafafa;
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
  color: ${TEXT_DARK_MAJOR};
  :hover {
    background: #fafafa;
  }
  ${(p) =>
    p.isActive &&
    css`
      background: #fafafa;
    `}
  ${(p) =>
    p.delay &&
    typeof p.delay === "number" &&
    p.delay >= 0 &&
    css`
      > .delay {
        color: #3abc3f;
      }
    `}
  ${(p) =>
    p.delay &&
    typeof p.delay === "number" &&
    p.delay >= 100 &&
    css`
      > .delay {
        color: #ee7735;
      }
    `}
  ${(p) =>
    p.delay &&
    typeof p.delay === "number" &&
    p.delay >= 300 &&
    css`
      > .delay {
        color: #ec4730;
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
    (item) => item.url === currentNodeSetting?.[chain]
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

  useOutsideClick(symbolRef, () => {
    setSymbolOpen(false);
  });
  useOutsideClick(netWorkRef, () => {
    setNetorkOpen(false);
  });

  const switchNode = (node) => {
    if (node === chain) return;
    dispatch(
      setCurrentNode({
        chain: node,
        url: currentNodeSetting.polkadot,
        refresh: true,
      })
    );
  };
  const switchNetwork = (url) => {
    if (url && url === currentNetwork?.url) return;
    dispatch(
      setCurrentNode({
        chain,
        url,
      })
    );
    const nodeName = nodesSetting[chain].find((item) => item.url === url)?.name;
    dispatch(
      addToast({
        type: "success",
        message: `Node switched to ${nodeName}!`,
      })
    );
  };

  return (
    <NetworkWrapper>
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
          ref={symbolRef}
          isActive={symbolOpen}
        >
          <Image
            src={`${
              symbolOpen
                ? "/imgs/icon-triangle-up.svg"
                : "/imgs/icon-triangle-down.svg"
            }`}
          />
          {symbolOpen && (
            <SymbolWrapper>
              <SymbolItem
                isActive={chain === "polkadot"}
                onClick={() => {
                  switchNode("polkadot");
                }}
              >
                <Image src="/imgs/logo-polkadot.svg" />
                <div>Polkadot</div>
                <div className="unit">DOT</div>
              </SymbolItem>
              <SymbolItem
                isActive={chain === "kusama"}
                onClick={() => {
                  switchNode("kusama");
                }}
              >
                <Image src="/imgs/logo-kusama.svg" />
                <div>Kusama</div>
                <div className="unit">KSM</div>
              </SymbolItem>
            </SymbolWrapper>
          )}
        </Button>
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

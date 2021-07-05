import React, { useState } from "react";
import styled from "styled-components";
import { Image, Modal } from "semantic-ui-react";
import { useDispatch, useSelector } from "react-redux";

import Card from "../Card";
import Title from "../Title";
import Text from "../Text";
import Button from "../Button";
import ButtonPrimary from "../ButtonPrimary";
import SettingItem from "./SettingItem";
import NetworkItem from "./NetworkItem";
import {
  currentNodeSelector,
  setCurrentNode,
  nodesSelector,
} from "../../store/reducers/nodeSlice";
import useUpdateNodesDelay from "../../utils/useUpdateNodesDelay";
import GrayImage from "../GrayImage";
import { PRIMARY_THEME_COLOR } from "../../constants";
import { chainSelector } from "../../store/reducers/chainSlice";

const Wrapper = styled.div``;

const StyledModal = styled(Modal)`
  max-width: 424px !important;
  border-radius: 8px !important;
  /* top: 112px; */
`;

const StyledTitle = styled(Title)`
  text-align: center;
  margin-bottom: 24px;
`;

const StyledText = styled(Text)`
  font-weight: 500;
  margin-bottom: 8px;
  text-transform: capitalize;
`;

const StyledCard = styled(Card)`
  padding: 32px !important;
  position: relative !important;
`;

const StyledButton = styled(Button)`
  height: 32px !important;
  padding: 9px !important;

  display: flex !important;
  align-items: center;
  border: 0 !important;
  background: #fbfbfb !important;
  &:hover {
    color: ${PRIMARY_THEME_COLOR} !important;
    & > :first-child {
      -webkit-filter: grayscale(0);
      filter: grayscale(0);
      opacity: 1;
    }
  }
`;

const SettingList = styled.div`
  margin-bottom: 24px;
`;

const CloseButton = styled(Image)`
  position: absolute !important;
  top: 42px;
  right: 32px;
  cursor: pointer;
`;

const StyledButtonPrimary = styled(ButtonPrimary)`
  width: 100%;
`;

const Setting = () => {
  const [open, setOpen] = React.useState(false);
  const dispatch = useDispatch();

  const chain = useSelector(chainSelector);
  const nodesSetting = useSelector(nodesSelector);
  const currentNodeSetting = useSelector(currentNodeSelector);

  const [selectedNetwork, setSelectedNetwork] = useState(chain);
  const defaultNode = currentNodeSetting?.[selectedNetwork];
  const [selectedNode, setSelectedNode] = useState(defaultNode);

  const closeModal = () => {
    setOpen(false);
    setSelectedNode(defaultNode);
  };

  const _setSelectedNetwork = (chain) => {
    const defaultNode = currentNodeSetting?.[chain];
    setSelectedNode(defaultNode);
    setSelectedNetwork(chain);
  };

  useUpdateNodesDelay();

  return (
    <StyledModal
      onClose={() => closeModal()}
      onOpen={() => setOpen(true)}
      open={open}
      trigger={
        <Wrapper>
          <StyledButton open={open}>
            <GrayImage src="/imgs/setting-dark.svg" />
          </StyledButton>
        </Wrapper>
      }
    >
      <StyledCard>
        <CloseButton src="/imgs/close.svg" onClick={() => closeModal()} />
        <StyledTitle>Setting</StyledTitle>
        <StyledText>{`Network`}</StyledText>
        <SettingList>
          <NetworkItem
            icon={"/imgs/logo-polkadot.svg"}
            name={"polkadot"}
            selectedNetwork={selectedNetwork}
            setSelectedNetwork={_setSelectedNetwork}
          />
          <NetworkItem
            icon={"/imgs/logo-kusama.svg"}
            name={"kusama"}
            selectedNetwork={selectedNetwork}
            setSelectedNetwork={_setSelectedNetwork}
          />
        </SettingList>
        <StyledText>{`Nodes`}</StyledText>
        <SettingList>
          {(nodesSetting?.[selectedNetwork] || []).map((item, index) => (
            <SettingItem
              key={index}
              node={item}
              selectedNode={selectedNode}
              setSelectedNode={setSelectedNode}
            />
          ))}
        </SettingList>
        <StyledButtonPrimary
          disabled={selectedNode === defaultNode && selectedNetwork === chain}
          onClick={() => {
            dispatch(
              setCurrentNode({
                chain: selectedNetwork,
                url: selectedNode,
                refresh: true,
              })
            );
          }}
        >
          Switch
        </StyledButtonPrimary>
      </StyledCard>
    </StyledModal>
  );
};

export default Setting;

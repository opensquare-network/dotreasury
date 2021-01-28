import React, { useState } from "react";
import styled from "styled-components";
import { Image, Modal } from "semantic-ui-react";
import { useDispatch, useSelector } from "react-redux";

import Card from "../../components/Card";
import Title from "../../components/Title";
import Text from "../../components/Text";
import Button from "../../components/Button";
import ButtonPrimary from "../../components/ButtonPrimary";
import SettingItem from "./SettingItem";
import {
  currentNodeSelector,
  setCurrentNode,
  nodesSelector,
} from "../../store/reducers/nodeSlice";
import useUpdateNodesDelay from "../../utils/useUpdateNodesDelay";


const Wrapper = styled.div`
  margin-right: 32px;
`

const StyledModal = styled(Modal)`
  width: 424px !important;
  border-radius: 8px !important;
  top: 112px;
`

const StyledTitle = styled(Title)`
  text-align: center;
  margin-bottom: 24px;
`

const StyledText = styled(Text)`
  font-weight: 500;
  margin-bottom: 8px;
`

const StyledCard = styled(Card)`
  padding: 32px !important;
`

const StyledButton = styled(Button)`
  display: flex !important;
  align-items: center;
  border: 0 !important;
  padding-left: 0 !important;
  padding-right: 0 !important;
  & > :first-child {
    margin-right: 8px;
  }
`

const SettingList = styled.div`
  margin-bottom: 24px;
`

const CloseButton = styled(Image)`
  position: absolute !important;
  top: 42px;
  right: 32px;
  cursor: pointer;
`

const StyledButtonPrimary = styled(ButtonPrimary)`
  width: 100%;
`

const Setting = () => {
  const [open, setOpen] = React.useState(false);
  const dispatch = useDispatch();
  const currentNode = useSelector(currentNodeSelector);
  const [selectedNode, setSelectedNode] = useState(currentNode);
  const nodes = useSelector(nodesSelector);

  const closeModal = () => {
    setOpen(false);
    setSelectedNode(currentNode);
  }

  useUpdateNodesDelay();

  return (
    <StyledModal
      onClose={() => closeModal()}
      onOpen={() => setOpen(true)}
      open={open}
      trigger={
        <Wrapper>
          <StyledButton open={open}>
            <Image src="/imgs/setting.svg" />
            Setting
          </StyledButton>
        </Wrapper>
      }
    >
      <StyledCard>
        <CloseButton src="/imgs/close.svg" onClick={() => closeModal()} />
        <StyledTitle>Setting</StyledTitle>
        <StyledText>Kusama nodes</StyledText>
        <SettingList>
          {(nodes || []).map((item, index) => (<SettingItem
            key={index}
            node={item}
            selectedNode={selectedNode}
            setSelectedNode={setSelectedNode} />)
          )}
        </SettingList>
        <StyledButtonPrimary onClick={() => {
          dispatch(setCurrentNode(selectedNode));
          closeModal();
        }}>Switch</StyledButtonPrimary>
      </StyledCard>
    </StyledModal>
  )
}

export default Setting;

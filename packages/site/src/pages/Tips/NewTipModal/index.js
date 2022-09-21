import styled from "styled-components";
import { Modal } from "semantic-ui-react";
import { ReactComponent as CloseSVG } from "./close.svg";
import { ReactComponent as MinusSVG } from "./minus.svg";
import { ReactComponent as AddSVG } from "./add.svg";
import Signer from "./Signer";
import TipInputs from "./TipInputs";
import { useCallback, useState } from "react";
import ButtonPrimary from "../../../components/ButtonPrimary";

const StyledModal = styled(Modal)`
  padding: 32px;
  > :nth-child(1) {
    margin-bottom: 16px;
  }
  > :nth-child(2) {
    margin-bottom: 24px;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.div`
  font-style: normal;
  font-weight: 600;
  font-size: 18px;
  line-height: 28px;
  color: rgba(0, 0, 0, 0.9);
`;

const Batch = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Close = styled(CloseSVG)`
  cursor: pointer;
`;

const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 24px;
`;

const Add = styled(AddSVG)`
  cursor: pointer;
`;

const Minus = styled(MinusSVG)`
  cursor: pointer;
`;

export default function NewTipModal({ visible, setVisible }) {
  const [newTips, setNewTips] = useState([{}, {}]);

  const onAdd = useCallback(() => {
    setNewTips([...newTips, {}]);
  }, [newTips])

  const onMinus = useCallback(() => {
    if (newTips.length > 1) {
      setNewTips(newTips.slice(0, newTips.length - 1));
    }
  }, [newTips])

  const onDelete = useCallback((index) => {
    setNewTips([
      ...newTips.slice(0, index),
      ...newTips.slice(index + 1, newTips.length),
    ]);
  }, [newTips]);

  return (
    <StyledModal
      size="small"
      open={visible}
      onClose={() => setVisible(false)}
    >
      <Header>
        <Title>New Tip</Title>
        <Close onClick={() => setVisible(false)} />
      </Header>
      <Signer />
      <Batch>
        {newTips.map((tipData, index) => (
          <TipInputs
            key={index}
            index={index}
            isCouncilor={true}
            canDelete={newTips.length > 1}
            onDelete={() => onDelete(index)}
            tipData={tipData}
          />
        ))}
      </Batch>
      <Footer>
        <div style={{ display: "flex", gap: "8px" }}>
          <Add onClick={onAdd} />
          <Minus onClick={onMinus} />
        </div>
        <ButtonPrimary>Submit</ButtonPrimary>
      </Footer>
    </StyledModal>
  );}

import styled from "styled-components";
import { Modal } from "semantic-ui-react";
import { ReactComponent as CloseSVG } from "./close.svg";
import { ReactComponent as MinusSVG } from "./minus.svg";
import { ReactComponent as AddSVG } from "./add.svg";
import Signer from "./Signer";
import TipInputs from "./TipInputs";
import { useCallback, useState } from "react";
import ButtonPrimary from "../../../components/ButtonPrimary";
import useApi from "../../../hooks/useApi";
import { web3Enable, web3FromSource } from "@polkadot/extension-dapp";
import { useDispatch, useSelector } from "react-redux";
import { accountSelector } from "../../../store/reducers/accountSlice";
import { newErrorToast } from "../../../store/reducers/toastSlice";
import { sendTx } from "../../../utils/sendTx";
import { useIsMounted } from "../../../utils/hooks";
import { isAddress } from "@polkadot/util-crypto";
import BigNumber from "bignumber.js";
import useCouncilMembers from "../../../utils/useCouncilMembers";
import { getPrecision } from "../../../utils";
import { chainSymbolSelector } from "../../../store/reducers/chainSlice";

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

export default function NewTipModal({ visible, setVisible, onFinalized }) {
  const dispatch = useDispatch();
  const [newTips, setNewTips] = useState([{ id: 0 }]);
  const [count, setCount] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const account = useSelector(accountSelector);
  const api = useApi();
  const isMounted = useIsMounted();
  const councilMembers = useCouncilMembers();
  const isCouncilor = councilMembers?.includes(account?.address);
  const symbol = useSelector(chainSymbolSelector);
  const precision = getPrecision(symbol);

  const showErrorToast = (message) => dispatch(newErrorToast(message));

  const onAdd = useCallback(() => {
    setNewTips([...newTips, { id: count }]);
    setCount(count + 1);
  }, [newTips, count])

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

  const submit = async () => {
    // Check data
    for (const newTip of newTips) {
      if (!newTip.beneficiary) {
        return showErrorToast("Beneficiary is empty");
      }
      if (!isAddress(newTip.beneficiary)) {
        return showErrorToast("Invalid beneficiary address");
      }
      if (isCouncilor) {
        if (!newTip.value) {
          return showErrorToast("Value cannot be empty");
        }
        const bnValue = new BigNumber(newTip.value);
        if (bnValue.isNaN()) {
          return showErrorToast("Value must be number");
        }
        if (!bnValue.gt(0)) {
          return showErrorToast("Value must larger then 0");
        }
      }
      if (!newTip.reason) {
        return showErrorToast("Reason cannot be empty");
      }
    }

    if (!api) {
      return showErrorToast("Chain network is not connected yet");
    }

    setIsLoading(true);

    try {
      web3Enable("doTreasury");
      const injector = await web3FromSource(account.extension);

      const txs = newTips.map(item => {
        if (isCouncilor) {
          return api.tx.tips.tipNew(
            item.reason,
            item.beneficiary,
            parseInt(item.value) * Math.pow(10, precision)
          );
        } else {
          return api.tx.tips.reportAwesome(item.reason, item.beneficiary);
        }
      });

      let tx = txs[0];
      if (txs.length > 1) {
        tx = api.tx.utility.batch(txs);
      }

      await sendTx({
        txName: "New Tips",
        tx,
        signer: injector.signer,
        dispatch,
        signerAddress: account.address,
        isMounted,
        onSubmitted: () => setVisible(false),
        onFinalized,
      });
    } finally {
      setIsLoading(false);
    }
  };

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
            key={tipData.id}
            index={index}
            isCouncilor={isCouncilor}
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
        <ButtonPrimary disabled={isLoading} onClick={submit}>Submit</ButtonPrimary>
      </Footer>
    </StyledModal>
  );}

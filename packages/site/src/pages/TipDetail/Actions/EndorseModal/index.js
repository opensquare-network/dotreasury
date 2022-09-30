import styled from "styled-components";
import { useState } from "react";
import ButtonPrimary from "../../../../components/ButtonPrimary";
import Signer from "../../../../components/ActionSigner";
import ActionModal from "../../../../components/ActionModal";
import { Field, FieldTitle } from "../../../../components/ActionModal/styled";
import AssetInput from "../../../../components/AssetInput";
import { chainSymbolSelector } from "../../../../store/reducers/chainSlice";
import { useDispatch, useSelector } from "react-redux";
import Tipping from "./Tipping";
import { checkInputValue, getPrecision, toPrecision } from "../../../../utils";
import useApi from "../../../../hooks/useApi";
import { accountSelector } from "../../../../store/reducers/accountSlice";
import { newErrorToast } from "../../../../store/reducers/toastSlice";
import { web3Enable, web3FromSource } from "@polkadot/extension-dapp";
import { sendTx } from "../../../../utils/sendTx";
import { useIsMounted } from "../../../../utils/hooks";
import BigNumber from "bignumber.js";
import { useEffect } from "react";
import useCouncilMembers from "../../../../utils/useCouncilMembers";

const Footer = styled.div`
  display: flex;
  justify-content: right;
  margin-top: 24px;
`;

const InputsPanel = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid #F4F4F4;
  border-radius: 4px;
  padding: 16px;
  gap: 16px;
`;

export default function EndorseModal({ tipDetail, visible, setVisible, onFinalized }) {
  const dispatch = useDispatch();
  const isMounted = useIsMounted();
  const account = useSelector(accountSelector);
  const symbol = useSelector(chainSymbolSelector);
  const [isLoading, setIsLoading] = useState(false);
  const precision = getPrecision(symbol);
  const [inputTipValue, setInputTipValue] = useState();
  const api = useApi();
  const tipHash = tipDetail?.hash;
  const councilMembers = useCouncilMembers();

  const isCouncilor = councilMembers?.includes(account?.address);

  useEffect(() => {
    if (tipDetail) {
      const initialMedianValue = toPrecision(tipDetail?.medianValue || 0, precision, false);
      setInputTipValue(initialMedianValue)
    }
  }, [tipDetail, precision]);

  const showErrorToast = (message) => dispatch(newErrorToast(message));

  const submit = async () => {
    if (!api) {
      return;
    }

    if (!account) {
      return;
    }

    if (!tipHash) {
      return;
    }

    const errorMsg = checkInputValue(inputTipValue, "Tip value");
    if (errorMsg) {
      return showErrorToast(errorMsg);
    }

    const tipValue = new BigNumber(inputTipValue).times(Math.pow(10, precision)).toString();

    setIsLoading(true);
    try {
      web3Enable("doTreasury");
      const injector = await web3FromSource(account.extension);

      const tx = api.tx.tips.tip(tipDetail.hash, tipValue);

      await sendTx({
        txName: "Endorse",
        tx,
        signer: injector.signer,
        dispatch,
        signerAddress: account.address,
        isMounted,
        onFinalized,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ActionModal title="Endorse" visible={visible} setVisible={setVisible}>
      <Signer />
      <InputsPanel>
        <Field>
          <FieldTitle>Value</FieldTitle>
          <AssetInput
            symbol={symbol}
            placeholder="0"
            defaultValue={inputTipValue}
            onChange={e => setInputTipValue(e.target.value)}
          />
        </Field>
        <Field>
          <FieldTitle>Current tipping</FieldTitle>
          <Tipping tipDetail={tipDetail} />
        </Field>
      </InputsPanel>
      <Footer>
        <ButtonPrimary disabled={isLoading || !isCouncilor} onClick={submit}>Submit</ButtonPrimary>
      </Footer>
    </ActionModal>
  );
}

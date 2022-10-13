import { web3Enable, web3FromSource } from "@polkadot/extension-dapp";
import BigNumber from "bignumber.js";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import ActionModal from "../../../components/ActionModal";
import Signer from "../../../components/ActionSigner";
import ButtonPrimary from "../../../components/ButtonPrimary";
import useApi from "../../../hooks/useApi";
import { accountSelector } from "../../../store/reducers/accountSlice";
import { chainSymbolSelector } from "../../../store/reducers/chainSlice";
import { newErrorToast } from "../../../store/reducers/toastSlice";
import { checkInputValue, getPrecision, toPrecision } from "../../../utils";
import { useIsMounted } from "../../../utils/hooks";
import { sendTx } from "../../../utils/sendTx";
import { ErrorMessage } from "../../../components/styled";
import { Field, FieldTitle } from "../../../components/ActionModal/styled";
import CustomInput from "../../../components/Input";
import AssetInput from "../../../components/AssetInput";
import TextBox from "../../../components/TextBox";
import { countUtf8Bytes } from "../../../utils/bountyHelper";
import useChildBountyConsts from "../../../hooks/useChildBountyConsts";

const Footer = styled.div`
  display: flex;
  justify-content: right;
  margin-top: 24px;
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;

  border: 1px solid #F4F4F4;
  border-radius: 4px;

  .error {
    margin-bottom: 8px;
  }
`;

export default function NewChildBountyModal({ visible, setVisible, parentBountyId, onFinalized }) {
  const dispatch = useDispatch();
  const [errorMessage, setErrorMessage] = useState();
  const [childBountyTitle, setChildBountyTitle] = useState();
  const [inputValue, setInputValue] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const account = useSelector(accountSelector);
  const api = useApi();
  const isMounted = useIsMounted();
  const symbol = useSelector(chainSymbolSelector);
  const precision = getPrecision(symbol);

  useEffect(() =>{
    setErrorMessage();
    setChildBountyTitle("");
    setInputValue("");
  }, [visible]);

  const showErrorToast = (message) => dispatch(newErrorToast(message));

  const {
    childBountyValueMinimum,
    maximumReasonLength,
  } = useChildBountyConsts(api);

  const submit = async () => {
    if (!api) {
      return showErrorToast("Chain network is not connected yet");
    }

    if (!account) {
      return showErrorToast("Please connect wallet first");
    }

    setErrorMessage();

    if (!childBountyTitle) {
      setErrorMessage("Child bounty title is required");
      return;
    }

    if (countUtf8Bytes(childBountyTitle) > maximumReasonLength) {
      setErrorMessage(`Child bounty title is too long`);
      return;
    }

    let errorMsg = checkInputValue(inputValue);
    if (errorMsg) {
      setErrorMessage(errorMsg);
      return;
    }

    const minInputValue = toPrecision(childBountyValueMinimum, precision, false);
    if (new BigNumber(inputValue).lt(minInputValue)) {
      setErrorMessage(`The minimum of bounty value is ${minInputValue} ${symbol}`);
      return;
    }

    setIsLoading(true);

    try {
      web3Enable("doTreasury");
      const injector = await web3FromSource(account.extension);

      const bnValue = new BigNumber(inputValue).times(Math.pow(10, precision));
      const tx = api.tx.childBounties.addChildBounty(parentBountyId, bnValue.toString(), childBountyTitle);

      await sendTx({
        txName: "New Child Bounty",
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
    <ActionModal title="New Child Bounty" visible={visible} setVisible={setVisible}>
      <div style={{ marginBottom: "24px" }}>
        <Signer />
      </div>
      <Body>
        {errorMessage && (
          <ErrorMessage className="error">{errorMessage}</ErrorMessage>
        )}
        <Field>
          <FieldTitle>Bounty Id</FieldTitle>
          <TextBox>{parentBountyId}</TextBox>
        </Field>
        <Field>
          <FieldTitle>Child bounty title</FieldTitle>
          <CustomInput
            placeholder="Please fill child bounty title..."
            onChange={e => setChildBountyTitle(e.target.value)}
          />
        </Field>
        <Field>
          <FieldTitle>Value</FieldTitle>
          <AssetInput
            symbol={symbol}
            placeholder="0"
            onChange={e => setInputValue(e.target.value)}
          />
        </Field>
      </Body>
      <Footer>
        <ButtonPrimary disabled={isLoading} onClick={submit}>Submit</ButtonPrimary>
      </Footer>
    </ActionModal>
  );
}

import { web3Enable, web3FromSource } from "@polkadot/extension-dapp";
import BigNumber from "bignumber.js";
import { useState } from "react";
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
import TextBox, { TextBoxLoading } from "../../../components/TextBox";
import useBountyBond from "../../../hooks/useBountyBond";
import useBountyConsts from "../../../hooks/useBountyConsts";
import { countUtf8Bytes } from "../../../utils/bountyHelper";
import useBalance from "../../../utils/useBalance";

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

export default function NewBountyModal({ visible, setVisible, onFinalized }) {
  const dispatch = useDispatch();
  const [errorMessage, setErrorMessage] = useState();
  const [bountyTitle, setBountyTitle] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const account = useSelector(accountSelector);
  const api = useApi();
  const isMounted = useIsMounted();
  const symbol = useSelector(chainSymbolSelector);
  const precision = getPrecision(symbol);

  const showErrorToast = (message) => dispatch(newErrorToast(message));

  const { bond, isLoading: isLoadingBond } = useBountyBond(api, bountyTitle);
  const {
    bountyValueMinimum,
    maximumReasonLength,
  } = useBountyConsts(api);
  const { balance } = useBalance(api, account?.address);

  const submit = async () => {
    if (!api) {
      return showErrorToast("Chain network is not connected yet");
    }

    if (!account) {
      return showErrorToast("Please connect wallet first");
    }

    setErrorMessage();

    if (!bountyTitle) {
      setErrorMessage("Bounty title is required");
      return;
    }

    if (countUtf8Bytes(bountyTitle) > maximumReasonLength) {
      setErrorMessage(`Bounty title is too long`);
      return;
    }

    let errorMsg = checkInputValue(inputValue);
    if (errorMsg) {
      setErrorMessage(errorMsg);
      return;
    }

    const minInputValue = toPrecision(bountyValueMinimum, precision, false);
    if (new BigNumber(inputValue).lt(minInputValue)) {
      setErrorMessage(`The minimum of bounty value is ${minInputValue} ${symbol}`);
      return;
    }

    if (new BigNumber(bond).gt(balance)) {
      setErrorMessage(`Account does not have enough funds`);
      return;
    }

    setIsLoading(true);

    try {
      web3Enable("doTreasury");
      const injector = await web3FromSource(account.extension);

      const bnValue = new BigNumber(inputValue).times(Math.pow(10, precision));
      const tx = api.tx.bounties.proposeBounty(bnValue.toString(), bountyTitle);

      await sendTx({
        txName: "New Bounty",
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
    <ActionModal title="New Bounty" visible={visible} setVisible={setVisible}>
      <div style={{ marginBottom: "24px" }}>
        <Signer />
      </div>
      <Body>
        {errorMessage && (
          <ErrorMessage>{errorMessage}</ErrorMessage>
        )}
        <Field>
          <FieldTitle>Bounty title</FieldTitle>
          <CustomInput
            placeholder="Please fill bounty title..."
            onChange={e => setBountyTitle(e.target.value)}
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
        <Field>
          <FieldTitle>Bounty bond</FieldTitle>
          {isLoadingBond ? (
            <TextBoxLoading />
          ) : (
            <TextBox>
              <span>{toPrecision(bond, precision, false)}</span>
              <span>{symbol}</span>
            </TextBox>
          )}
        </Field>
      </Body>
      <Footer>
        <ButtonPrimary disabled={isLoading} onClick={submit}>Submit</ButtonPrimary>
      </Footer>
    </ActionModal>
  );
}

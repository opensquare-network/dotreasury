import styled from "styled-components";
import isEmpty from "lodash.isempty";
import ButtonPrimary from "../../../components/ButtonPrimary";
import ActionModal from "../../../components/ActionModal";
import Signer from "../../../components/ActionSigner";
import { useState } from "react";
import { useEffect } from "react";
import serverApi from "../../../services/scanApi";
import { useDispatch, useSelector } from "react-redux";
import { chainSelector, chainSymbolSelector } from "../../../store/reducers/chainSlice";
import useTipsTable from "./useTipsTable";
import { sendTx } from "../../../utils/sendTx";
import { web3Enable, web3FromSource } from "@polkadot/extension-dapp";
import { accountSelector } from "../../../store/reducers/accountSlice";
import { useIsMounted } from "@osn/common";
import { checkInputValue, getPrecision } from "../../../utils";
import { newErrorToast } from "../../../store/reducers/toastSlice";
import { ErrorMessage, HintMessage } from "../../../components/styled";
import useApi from "../../../hooks/useApi";
import useCouncilMembers from "../../../utils/useCouncilMembers";
import Tooltip from "../../../components/Tooltip";
import { TooltipInfoText } from "../../../components/Tooltip/styled";
import BigNumber from "bignumber.js";

const Body = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Footer = styled.div`
  display: flex;
  justify-content: right;
  margin-top: 24px;
`;

export default function EndorseTipsModal({ visible, setVisible, onFinalized }) {
  const [tips, setTips] = useState([]);
  const [isLoadingTips, setIsLoadingTips] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const chain = useSelector(chainSelector);
  const dispatch = useDispatch();
  const account = useSelector(accountSelector);
  const isMounted = useIsMounted();
  const [errorMessage, setErrorMessage] = useState();
  const api = useApi();
  const councilMembers = useCouncilMembers();
  const symbol = useSelector(chainSymbolSelector);
  const precision = getPrecision(symbol);

  const isCouncilor = councilMembers?.includes(account?.address);

  const isLoggedIn = !!account;

  const showErrorToast = (message) => dispatch(newErrorToast(message));

  const {
    Component: TipsTable,
    tipValues,
  } = useTipsTable({ tips, isLoading: isLoadingTips });

  const disabled = !isLoggedIn || isEmpty(tipValues) || !isCouncilor || isLoading;

  useEffect(() => {
    if (!account) {
      return;
    }

    setIsLoadingTips(true);

    serverApi.fetch(`/${chain}/tipping`, { tipper: account?.address })
      .then(({ result }) => {
        if (result) {
          setTips(result || []);
        }
      })
      .finally(() => {
        setIsLoadingTips(false);
      });
  }, [chain, account]);

  const submit = async () => {
    if (!api) {
      return showErrorToast("Chain network is not connected yet");
    }

    if (!account) {
      return showErrorToast("Please connect wallet first");
    }

    setErrorMessage();

    const txs = [];
    for (const hash in tipValues) {
      const inputTipValue = tipValues[hash];
      const errMsg = checkInputValue(inputTipValue, "Tip value", true);
      if (errMsg) {
        setErrorMessage(errMsg);
        return;
      }

      const bnTipValue = new BigNumber(inputTipValue).times(Math.pow(10, precision));
      txs.push(api.tx.tips.tip(hash, bnTipValue.toString()));
    };

    let tx = txs[0];
    if (txs.length > 1) {
      tx = api.tx.utility.batch(txs);
    }

    setIsLoading(true);

    try {
      web3Enable("doTreasury");
      const injector = await web3FromSource(account.extension);

      await sendTx({
        txName: "Endorse Tips",
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

  let tooltipContent = "";
  if (!isLoggedIn) {
    tooltipContent = "Please connect wallet first";
  } else if (!isCouncilor) {
    tooltipContent = "Only councilors can endorse tips";
  } else if (isEmpty(tipValues)) {
    tooltipContent = "No tips to endorse";
  }

  return (
    <ActionModal
      title="Endorse Tips"
      size="large"
      visible={visible}
      setVisible={setVisible}
      maxWidth={800}
    >
      <Body>
        <Signer />
        <HintMessage>Only show tips that you’ve not endorsed.</HintMessage>
        {errorMessage && (
          <ErrorMessage>{errorMessage}</ErrorMessage>
        )}
        {TipsTable}
      </Body>
      <Footer>
        <Tooltip
          showTooltip={!!tooltipContent}
          tooltipContent={
            tooltipContent && (
              <TooltipInfoText>{tooltipContent}</TooltipInfoText>
            )
          }
        >
          <ButtonPrimary disabled={disabled} onClick={submit}>Submit</ButtonPrimary>
        </Tooltip>
      </Footer>
    </ActionModal>
  );
}

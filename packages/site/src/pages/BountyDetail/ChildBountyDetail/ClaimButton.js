import { web3Enable, web3FromSource } from "@polkadot/extension-dapp";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled, { css } from "styled-components";
import useApi from "../../../hooks/useApi";
import { accountSelector } from "../../../store/reducers/accountSlice";
import {
  newErrorToast,
} from "../../../store/reducers/toastSlice";
import { useIsMounted } from "../../../utils/hooks";
import { sendTx } from "../../../utils/sendTx";
import { PRIMARY_THEME_COLOR } from "../../../constants";
import { isSameAddress } from "../../../utils";


const Wrapper = styled.div`
  cursor: pointer;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 4px 8px;

  background: ${PRIMARY_THEME_COLOR};
  border-radius: 4px;

  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 16px;
  color: white;

  ${p => p.disabled ? css`
    color: white;
    background: #F292A4;
    opacity: 1;
  ` : css`
    :hover {
      background: #E75973;
    }
  `}
`;

export default function ClaimButton({ parentBountyId, index, beneficiary, onInBlock, onFinalized }) {
  const api = useApi();
  const dispatch = useDispatch();
  const account = useSelector(accountSelector);
  const [isLoading, setIsLoading] = useState(false);
  const isMounted = useIsMounted();

  const isBeneficiary = isSameAddress(account?.address, beneficiary);
  const disabled = !isBeneficiary || isLoading;

  const showErrorToast = (message) => dispatch(newErrorToast(message));

  const doClaim = async () => {
    if (disabled) {
      return;
    }

    if (!api) {
      return showErrorToast("Chain network is not connected yet");
    }

    if (parentBountyId === undefined || index === undefined) {
      return;
    }

    setIsLoading(true);

    try {
      web3Enable("doTreasury");
      const injector = await web3FromSource(account.extension);

      const tx = api.tx.childBounties.claimChildBounty(parentBountyId, index);

      await sendTx({
        txName: "Claim Rewards",
        tx,
        signer: injector.signer,
        dispatch,
        signerAddress: account.address,
        isMounted,
        onInBlock,
        onFinalized,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Wrapper onClick={doClaim} disabled={disabled}>Claim Rewards</Wrapper>
  )
}

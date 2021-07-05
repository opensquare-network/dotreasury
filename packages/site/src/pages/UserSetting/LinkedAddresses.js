import React, { useEffect, useState } from "react";
import styled, { css } from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import {
  isWeb3Injected,
  web3Accounts,
  web3Enable,
} from "@polkadot/extension-dapp";

import api from "../../services/scanApi";
import { signMessage } from "../../services/chainApi";
import { useIsMounted } from "../../utils/hooks";
import {
  fetchUserProfile,
  userProfileSelector,
} from "../../store/reducers/userSlice";
import ButtonPrimary from "../../components/ButtonPrimary";
import { StyledItem, StyledTitle } from "./components";
import TextMinor from "../../components/TextMinor";
import Divider from "../../components/Divider";
import AccountItem from "../../components/AccountItem";
import ButtonImage from "../../components/ButtonImage";
import { addToast } from "../../store/reducers/toastSlice";
import {
  encodeKusamaAddress,
  encodePolkadotAddress,
} from "../../services/chainApi";
import ChainHeader from "./ChainHeader";
import NoAddress from "./NoAddress";
import DownloadPolkadot from "../../components/DownloadPolkadot";

const StyledTextMinor = styled(TextMinor)`
  margin-bottom: 16px;
`;

const StyledButtonPrimary = styled(ButtonPrimary)`
  width: 100%;
`;

const AccountWrapper = styled.div`
  padding: 4px 0;
  display: flex;
  border: 1px solid #eeeeee;
  align-items: center;
  justify-content: space-between;
  margin-top: 12px;
  :not(:last-child) {
    margin-bottom: 8px;
  }
  & > :last-child {
    padding-right: 16px !important;
  }
  ${(p) =>
    p.linked &&
    css`
      background: #fbfbfb;
      border-color: #fbfbfb;
    `}
`;

const DividerWrapper = styled(Divider)`
  margin: 2px 0 0 0 !important;
  border-top: 1px solid rgba(238, 238, 238, 1) !important;
`;

const LinkedAddress = () => {
  const isMounted = useIsMounted();
  const dispatch = useDispatch();
  const [hasExtension, setHasExtension] = useState(true);

  const userProfile = useSelector(userProfileSelector);
  const [accounts, setAccounts] = useState([]);
  const [activeChain, setActiveChain] = useState("polkadot");

  useEffect(() => {
    (async () => {
      await web3Enable("doTreasury");
      if (!isWeb3Injected) {
        if (isMounted.current) {
          setHasExtension(false);
        }
        return;
      }
    })();
  }, [isMounted]);

  const loadExtensionAddresses = async () => {
    await web3Enable("doTreasury");
    if (!isWeb3Injected) {
      if (isMounted.current) {
        console.error("Polkadot Extension is not installed");
      }
      return;
    }
    const extensionAccounts = await web3Accounts();
    const accounts = extensionAccounts.map((item) => {
      const {
        address,
        meta: { name },
      } = item;
      return {
        address,
        kusamaAddress: encodeKusamaAddress(address),
        polkadotAddress: encodePolkadotAddress(address),
        name,
      };
    });

    if (isMounted.current) {
      setAccounts(accounts);
    }
  };

  const unlinkAddress = async (chain, account) => {
    const address = account[`${chain}Address`];

    const { error, result } = await api.authFetch(
      `/user/linkaddr/${chain}/${address}`,
      {},
      {
        method: "DELETE",
      }
    );
    dispatch(fetchUserProfile());

    if (result) {
      dispatch(
        addToast({
          type: "success",
          message: "Unlink address successfully!",
        })
      );
    }

    if (error) {
      dispatch(
        addToast({
          type: "error",
          message: error.message,
        })
      );
    }
  };

  const linkAddress = async (chain, account) => {
    const address = account[`${chain}Address`];

    const { result, error } = await api.authFetch(
      `/user/linkaddr/${chain}/${address}`
    );
    if (result) {
      const signature = await signMessage(result?.challenge, account.address);
      const {
        error: confirmError,
        result: confirmResult,
      } = await api.authFetch(
        `/user/linkaddr/${result?.attemptId}`,
        {},
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ challengeAnswer: signature }),
        }
      );

      dispatch(fetchUserProfile());
      if (confirmResult) {
        dispatch(
          addToast({
            type: "success",
            message: "Link address successfully!",
          })
        );
      }

      if (confirmError) {
        dispatch(
          addToast({
            type: "error",
            message: confirmError.message,
          })
        );
      }
    }

    if (error) {
      dispatch(
        addToast({
          type: "error",
          message: error.message,
        })
      );
    }
  };

  const mergedAccounts = [
    ...accounts,
    ...(userProfile?.addresses || [])
      .filter(
        (address) =>
          !accounts.some((acc) => acc.address === address.wildcardAddress)
      )
      .map((address) => ({
        address: address.wildcardAddress,
        kusamaAddress: address.chain === "kusama" ? address.address : null,
        polkadotAddress: address.chain === "polkadot" ? address.address : null,
        name: "--",
      })),
  ];

  const availableAccounts =
    mergedAccounts?.filter((acc) => acc[`${activeChain}Address`]) || [];

  return (
    <StyledItem>
      <StyledTitle>Link address</StyledTitle>
      <StyledTextMinor>{`Associate your account with an on-chain address using the Polkadot{.js} extension.`}</StyledTextMinor>
      <StyledButtonPrimary onClick={loadExtensionAddresses}>
        Show avaliable addresses
      </StyledButtonPrimary>
      <div style={{ marginTop: "16px" }}>
        {!hasExtension && <DownloadPolkadot />}
        {hasExtension && (
          <>
            <ChainHeader
              activeChain={activeChain}
              setActiveChain={setActiveChain}
            />
            <DividerWrapper />
            {availableAccounts.length === 0 ? <NoAddress /> : <></>}
            {availableAccounts.map((account, index) => (
              <AccountWrapper
                key={index}
                linked={userProfile?.addresses?.some(
                  (i) => i.address === account[`${activeChain}Address`]
                )}
              >
                <AccountItem
                  accountName={account.name}
                  accountAddress={account[`${activeChain}Address`]}
                />
                {userProfile?.addresses?.some(
                  (i) => i.address === account[`${activeChain}Address`]
                ) ? (
                  <ButtonImage
                    src="/imgs/link-break.svg"
                    onClick={() => {
                      unlinkAddress(activeChain, account);
                    }}
                  >
                    Unlink
                  </ButtonImage>
                ) : (
                  <ButtonImage
                    src="/imgs/linked.svg"
                    onClick={() => {
                      linkAddress(activeChain, account);
                    }}
                  >
                    Link
                  </ButtonImage>
                )}
              </AccountWrapper>
            ))}
          </>
        )}
      </div>
    </StyledItem>
  );
};

export default LinkedAddress;

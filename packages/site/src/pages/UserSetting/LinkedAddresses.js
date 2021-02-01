import React, { useEffect, useState } from "react";
import styled from "styled-components";
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
  userProfileSelector
} from "../../store/reducers/userSlice";
import ButtonPrimary from "../../components/ButtonPrimary";
import { StyledItem, StyledTitle } from "./components";
import TextMinor from "../../components/TextMinor";
import Divider from "../../components/Divider";
import AccountItem from "../../components/AccountItem";
import ButtonImage from "../../components/ButtonImage";

const StyledTextMinor = styled(TextMinor)`
  margin-bottom: 16px;
`

const StyledButtonPrimary = styled(ButtonPrimary)`
  width: 100%;
`

const StyledDivider = styled(Divider)`
  margin: 24px 0;
`

const AccountWrapper = styled.div`
  padding: 4px 0;
  display: flex;
  background: #FBFBFB;
  align-items: center;
  justify-content: space-between;
  :not(:last-child) {
    margin-bottom: 8px;
  }
  & > :last-child {
    padding-right: 16px !important;
  }
`

const LinkedAddress = ({ username }) => {
  const isMounted = useIsMounted();
  const dispatch = useDispatch();

  const userProfile = useSelector(userProfileSelector);
  const [accounts, setAccounts] = useState([]);
  useEffect(() => {
    if (username) {
      dispatch(fetchUserProfile());
    }
  }, [dispatch, username]);

  const loadExtensionAddresses = async () => {
    await web3Enable("doTreasury");
    if (!isWeb3Injected) {
      if (isMounted.current) {
        console.error("Polkadot Extension is not installed");
      }
      return;
    }
    const extensionAccounts = await web3Accounts();
    const accounts = extensionAccounts.map(({ address, meta: { name } }) => {
      return {
        address,
        name,
      };
    });

    if (isMounted.current) {
      setAccounts(accounts);
    }
  };

  const unlinkAddress = async (address) => {
    await api.authFetch(
      `/user/linkaddr/${address}`,
      {},
      {
        method: "DELETE",
      }
    );
    dispatch(fetchUserProfile());
  };

  const linkAddress = async (address) => {
    const { result } = await api.authFetch(`/user/linkaddr/${address}`);
    if (result?.challenge) {
      const signature = await signMessage(result?.challenge, address);
      await api.authFetch(
        `/user/linkaddr/${address}`,
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
    }
  };

  const mergedAccounts = [
    ...accounts,
    ...(userProfile.addresses || [])
      .filter((address) => !accounts.some((acc) => acc.address === address))
      .map((address) => ({
        address,
        name: "unamed",
      })),
  ];

  return (
    <StyledItem>
      <StyledTitle>Linked addresses</StyledTitle>
      <StyledTextMinor>{`Associate your account with an on-chain address using the Polkadot{.js} extension.`}</StyledTextMinor>
        <StyledButtonPrimary onClick={loadExtensionAddresses}>
          Show avaliable addresses
        </StyledButtonPrimary>
        {mergedAccounts && mergedAccounts.length > 0 && <div>
        <StyledDivider />
        <StyledTitle>Linked addresses</StyledTitle>
        {mergedAccounts.map((account, index) => (
          <AccountWrapper key={index}>
            <AccountItem accountName={account.name} accountAddress={account.address} />
            {userProfile.addresses?.includes(account.address) ? (
              <ButtonImage
                src="/imgs/linked.svg"
                onClick={() => {
                  unlinkAddress(account.address);
                }}
              >
                Unlink
              </ButtonImage>
            ) : (
              <ButtonImage
                src="/imgs/linked.svg"
                onClick={() => {
                  linkAddress(account.address);
                }}
              >
                Link
              </ButtonImage>
            )}
          </AccountWrapper>
        ))}
      </div>}
    </StyledItem>
  )
}

export default LinkedAddress;

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { Button } from "semantic-ui-react";
import {
  isWeb3Injected,
  web3Accounts,
  web3Enable,
} from "@polkadot/extension-dapp";

import Title from "../../components/Title";
import ButtonPrimary from "../../components/ButtonPrimary";
import Address from "../../components/Address";
import { useIsMounted } from "../../utils/hooks";

import {
  fetchUserProfile,
  userProfileSelector,
  loggedInUserSelector,
} from "../../store/reducers/userSlice";

import api from "../../services/scanApi";
import { signMessage } from "../../services/chainApi";

const Header = styled(Title)`
  margin-bottom: 20px;
`;

const UserSetting = () => {
  const dispatch = useDispatch();
  const loggedInUser = useSelector(loggedInUserSelector);
  const isMounted = useIsMounted();

  const username = loggedInUser?.username;
  useEffect(() => {
    if (username) {
      dispatch(fetchUserProfile());
    }
  }, [dispatch, username]);

  const userProfile = useSelector(userProfileSelector);
  const [accounts, setAccounts] = useState([]);

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
    <>
      <Header>Settings</Header>
      {mergedAccounts.map((account, index) => (
        <div key={index}>
          <Address>{account.address}</Address>
          {userProfile.addresses?.includes(account.address) ? (
            <Button
              size="mini"
              onClick={() => {
                unlinkAddress(account.address);
              }}
            >
              Unlink
            </Button>
          ) : (
            <Button
              size="mini"
              color="green"
              onClick={() => {
                linkAddress(account.address);
              }}
            >
              Link
            </Button>
          )}
        </div>
      ))}
      <ButtonPrimary onClick={loadExtensionAddresses}>
        Show avaliable addresses
      </ButtonPrimary>
    </>
  );
};

export default UserSetting;

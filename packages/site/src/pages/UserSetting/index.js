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
import Card from "../../components/Card";
import Username from "./Username";
import Email from "./Email";
import Password from "./Password";
import Notification from "./Notifications";
import DeleteAccount from "./DeleteAccount";

const CardWrapper = styled(Card)`
  max-width: 424px;
  margin: 28px auto 0;
  padding: 32px;
`

const Header = styled(Title)`
  text-align: center;
`;

const UserSetting = () => {
  const dispatch = useDispatch();
  const loggedInUser = useSelector(loggedInUserSelector);
  const isMounted = useIsMounted();

  const username = loggedInUser?.username;
  const email = loggedInUser?.email;
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
      <CardWrapper>
        <Header>Settings</Header>
        <div>
          <Username username={username} />
          <Email email={email} />
          <Password />
          <Notification />
          <DeleteAccount />
        </div>
      </CardWrapper>
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

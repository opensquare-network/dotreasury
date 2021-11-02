import React, { useEffect, useState } from "react";
import styled from "styled-components";
import {
  isWeb3Injected,
  web3Accounts,
  web3Enable,
} from "@polkadot/extension-dapp";
import { useDispatch, useSelector } from "react-redux";
import { Modal } from "semantic-ui-react";
import { isLoginSelector, setAccount } from "../../store/reducers/accountSlice";
import Addr from "../../components/Address";
import queryString from "query-string";
import { useLocation, useHistory } from "react-router-dom";
import { useIsMounted } from "../../utils/hooks";

const SignInModal = styled(Modal)`
  .account-select-content {
    li {
      display: flex;
      justify-content: space-between;
      line-height: 36px;
      cursor: pointer;

      &:hover {
        background: #fbfbfb;
      }
    }
  }
`;

const AdminLogin = () => {
  const location = useLocation();
  const history = useHistory();
  const isMounted = useIsMounted();

  const [noExtensionModalOpen, setNoExtensionModalOpen] = useState(false);
  const [accountsModalOpen, setAccountsModalOpen] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const isLogin = useSelector(isLoginSelector);
  const dispatch = useDispatch();

  const q = queryString.parse(location.search);
  const isAdmin = q.admin === "true";

  useEffect(() => {
    if (!isLogin && isAdmin && !accountsModalOpen && !noExtensionModalOpen) {
      (async function login() {
        await web3Enable("doTreasury");
        if (!isWeb3Injected) {
          if (isMounted.current) {
            setNoExtensionModalOpen(true);
          }
          return;
        }
        const extensionAccounts = await web3Accounts();
        const accounts = extensionAccounts.map(
          ({ address, meta: { name } }) => {
            return {
              address,
              name,
            };
          }
        );

        if (isMounted.current) {
          setAccounts(accounts);
          setAccountsModalOpen(true);
        }
      })();
    }
  }, [isAdmin, isLogin, accountsModalOpen, noExtensionModalOpen, isMounted]);

  const loginAccount = async (account) => {
    setAccountsModalOpen(false);
    dispatch(setAccount(account));
  };

  return (
    <>
      <SignInModal
        size="mini"
        open={isAdmin && accountsModalOpen}
        onClose={() => {
          setAccountsModalOpen(false);
          history.goBack();
        }}
      >
        <Modal.Header>Select accounts</Modal.Header>
        <Modal.Content className="account-select-content">
          <ol>
            {accounts.map((account) => {
              return (
                <li
                  key={account.address}
                  onClick={async () => {
                    await loginAccount(account);
                  }}
                >
                  <span>{account.name}</span>
                  <Addr>{account.address}</Addr>
                </li>
              );
            })}
          </ol>
        </Modal.Content>
      </SignInModal>

      <Modal
        size="mini"
        open={isAdmin && noExtensionModalOpen}
        onClose={() => {
          setNoExtensionModalOpen(false);
          history.goBack();
        }}
      >
        <Modal.Header>Sign in</Modal.Header>
        <Modal.Content>
          Polkadot extension was not found. Please install or enable it.
        </Modal.Content>
      </Modal>
    </>
  );
};

export default AdminLogin;

import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { isWeb3Injected, web3Accounts, web3Enable } from '@polkadot/extension-dapp';
import { Modal } from "semantic-ui-react";
import Addr from "../../components/Address";
import { useIsMounted } from "../../utils/hooks";

const SignInModal = styled(Modal)`
  .account-select-content {
    li {
      display: flex;
      justify-content: space-between;
      line-height: 36px;
      cursor: pointer;

      &:hover {
        background: #FBFBFB;
      }
    }
  }
`

const SelectAddress = ({ onSelect = ()=>{}, onClose = ()=>{} }) => {
  const isMounted = useIsMounted();

  const [accountsModalOpen, setAccountsModalOpen] = useState(false);
  const [noExtensionModalOpen, setNoExtensionModalOpen] = useState(false)
  const [accounts, setAccounts] = useState([])

  useEffect(() => {
    if (!accountsModalOpen && !noExtensionModalOpen) {
      (async function login() {
        await web3Enable("doTreasury");
        if (!isWeb3Injected) {
          if (isMounted.current) {
            setNoExtensionModalOpen(true);
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
          setAccountsModalOpen(true);
        }
      })();
    }
  }, [accountsModalOpen, noExtensionModalOpen, isMounted]);

  const selectAccount = async (account) => {
    setAccountsModalOpen(false);
    onSelect(account);
  };

  if (!accountsModalOpen) {
    return null;
  }

  return (
    <>
      <SignInModal
        size="mini"
        open={accountsModalOpen}
        onClose={() => {
          onClose();
          setAccountsModalOpen(false);
        }}
      >
        <Modal.Header>Select accounts</Modal.Header>
        <Modal.Content className="account-select-content">
          <ol>
            {
              accounts.map(account => {
                return (
                  <li key={account.address} onClick={async () => {
                    await selectAccount(account)
                  }}>
                    <span>{account.name}</span>
                    <Addr>{account.address}</Addr>
                  </li>
                )
              })
            }
          </ol>
        </Modal.Content>
      </SignInModal>

      <Modal
        size="mini"
        open={noExtensionModalOpen}
        onClose={() => {
          onClose();
          setNoExtensionModalOpen(false);
        }}
      >
        <Modal.Header>Select accounts</Modal.Header>
        <Modal.Content>
          Polkadot extension was not found. Please install or enable it.
        </Modal.Content>
      </Modal>
    </>
  );
};

export default SelectAddress;

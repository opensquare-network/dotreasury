import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { isWeb3Injected, web3Accounts, web3Enable } from '@polkadot/extension-dapp';
import { Image, Modal } from "semantic-ui-react";
import { useIsMounted } from "../../utils/hooks";
import AccountItem from "../../components/AccountItem";
import { PRIMARY_THEME_COLOR } from "../../constants";
import Title from "../../components/Title";
import Text from "../../components/Text";
import { useDispatch } from "react-redux";
import { addToast } from "../../store/reducers/toastSlice";


const StyledButtonPrimary = styled.button`
  width: 100%;
  color: white !important;
  &.ui.button:hover,
  &.ui.button:active,
  &.ui.button:focus {
    background: #F23252 !important;
  }
  height: 40px;
  border: 0;
  outline: none;
  border-radius: 4px !important;
  cursor: pointer;

  background: #F23252 !important;
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 22px;
  color: #FFFFFF;

`;

const SettingList = styled.div`
  margin-bottom: 24px;
`

const CloseButton = styled(Image)`
  position: absolute !important;
  top: 42px;
  right: 32px;
  cursor: pointer;
  background-color: rgb(0,0,0,0) !important;
`

const StyledModal = styled(Modal)`
  max-width: 424px !important;
  border-radius: 8px !important;
  /* top: 112px; */
`

const StyledTitle = styled(Title)`
  text-align: center;
  margin-bottom: 24px;
`

const StyledText = styled(Text)`
  font-weight: 500;
  margin-bottom: 8px;
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 24px;
  color: #1D253C;
`

const StyledCard = styled.div`
  margin: 0 !important;
  padding: 32px !important;
  position: relative !important;
  width: 100% !important;
`

const AddressItem = styled.div`
  padding: 8px 16px;
  background: #FBFBFB;
  border-radius: 4px;
  display: flex;
  align-items: center;
  .grow {
    flex-grow: 1;
  }
  :not(:last-child) {
    margin-bottom: 8px;
  }
  cursor: pointer;
`

const CheckItem = styled.div`
  width: 16px;
  height: 16px;
  border: 1px solid rgba(29, 37, 60, 0.64);
  border-radius: 8px;
  margin-right: 8px;
  flex: 0 0 auto;
`

const CheckedItem = styled.div`
  width: 16px;
  height: 16px;
  border: 5px solid ${PRIMARY_THEME_COLOR};
  border-radius: 8px;
  margin-right: 8px;
  flex: 0 0 auto;
`


const SelectAddress = ({ onSelect = ()=>{}, onClose = ()=>{} }) => {
  const dispatch = useDispatch();
  const isMounted = useIsMounted();

  const [accountsModalOpen, setAccountsModalOpen] = useState(false);
  const [noExtensionModalOpen, setNoExtensionModalOpen] = useState(false)
  const [accounts, setAccounts] = useState([])
  const [selectedAccount, setSelectedAccount] = useState(null);

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

          const address = localStorage.getItem("lastSignatureAddress");
          setSelectedAccount(accounts.find(item => item.address === address));

          setAccountsModalOpen(true);
        }
      })();
    }
  }, [accountsModalOpen, noExtensionModalOpen, isMounted]);

  const selectAccount = async () => {
    if (!selectedAccount) {
      dispatch(addToast({
        type: "error",
        message: "Please select a signature address"
      }));
      return;
    }
    setAccountsModalOpen(false);
    onSelect(selectedAccount);
  };

  if (!accountsModalOpen) {
    return null;
  }

  const closeModal = () => {
    onClose();
    setAccountsModalOpen(false);
  };

  return (
    <>
      <StyledModal
        size="mini"
        open={accountsModalOpen}
        onClose={closeModal}
      >
        <StyledCard>
          <CloseButton src="/imgs/close.svg" onClick={closeModal} />
          <StyledTitle>Grading</StyledTitle>
          <StyledText>Select accounts</StyledText>
          <SettingList>
            {accounts.map((account, index) => (
              <AddressItem
                key={index}
                onClick={async () => {
                  setSelectedAccount(account);
                }}
              >
                {!(selectedAccount === account) && <CheckItem />}
                {(selectedAccount === account) && <CheckedItem />}
                <AccountItem
                  accountName={account.name}
                  accountAddress={account.address}
                />
              </AddressItem>
            ))}
          </SettingList>
          <StyledButtonPrimary
            onClick={() => {
              selectAccount();
          }}>Signature</StyledButtonPrimary>
        </StyledCard>
      </StyledModal>

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

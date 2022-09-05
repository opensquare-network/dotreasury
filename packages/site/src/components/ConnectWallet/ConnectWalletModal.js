import { useCallback, useState } from "react";
import { Modal } from "semantic-ui-react";
import styled from "styled-components";
import { ReactComponent as CloseSVG } from "./close.svg";
import WalletSelect from "./WalletSelect";
import AccountSelect from "./AccountSelect";
import { chainSelector } from "../../store/reducers/chainSlice";
import { useDispatch, useSelector } from "react-redux";
import ButtonPrimary from "../../components/ButtonPrimary";
import { setAccount } from "../../store/reducers/accountSlice";

const StyledModal = styled(Modal)`
  width: 424px;
  max-width: 424px;
  padding: 32px;
  > :nth-child(1) {
    margin-bottom: 16px;
  }
  > :nth-child(2) {
    margin-bottom: 24px;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.div`
  font-style: normal;
  font-weight: 600;
  font-size: 18px;
  line-height: 28px;
  color: rgba(0, 0, 0, 0.9);
`;

const Close = styled(CloseSVG)`
  cursor: pointer;
`;

const Description = styled.div`
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  color: rgba(0, 0, 0, 0.9);
`;

const Connect = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const ConnectButton = styled(ButtonPrimary)`
  width: 100%;
`;

export default function ConnectWalletModal({
  visible,
  setVisible,
}) {
  const dispatch = useDispatch();
  const [accounts, setAccounts] = useState([]);
  const [selectedWallet, setSelectedWallet] = useState(null);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const chain = useSelector(chainSelector);

  const onConnect = useCallback(() => {
    const account = {
      extension: selectedWallet,
      chain,
      address: selectedAccount.address
    };
    dispatch(setAccount(account));
    setVisible(false);
  }, [dispatch, selectedWallet, selectedAccount, chain, setVisible]);

  return (
    <StyledModal
      dimmer
      size="tiny"
      open={visible}
      onClose={() => setVisible(false)}
    >
      <Header>
        <Title>Connect Wallet</Title>
        <Close onClick={() => setVisible(false)} />
      </Header>
      <Description>
        By connecting wallet, I have read and agree to doTreasury’s the terms of the User Agreement and Privacy Notice.
      </Description>
      {
        (selectedWallet && accounts) ? (
          <Connect>
            <AccountSelect
              chain={chain}
              accounts={accounts}
              onSelect={setSelectedAccount}
            />
            <ConnectButton onClick={onConnect}>Connect</ConnectButton>
          </Connect>
        ) : (
          <WalletSelect
            setAccounts={setAccounts}
            onSelect={setSelectedWallet}
          />
        )
      }
    </StyledModal>
  );
}

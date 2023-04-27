import { useCallback, useState } from "react";
import { Modal } from "semantic-ui-react";
import styled, { css } from "styled-components";
import { ReactComponent as CloseSVG } from "./close.svg";
import WalletSelect from "./WalletSelect";
import AccountSelect from "./AccountSelect";
import { chainSelector } from "../../store/reducers/chainSlice";
import { useDispatch, useSelector } from "react-redux";
import ButtonPrimary from "../../components/ButtonPrimary";
import { setAccount } from "../../store/reducers/accountSlice";
import { rounded_8, shadow_200 } from "../../styles/tailwindcss";
import { smcss } from "../../styles/responsive";

const StyledModal = styled(Modal)`
  width: 400px !important;
  max-width: 400px !important;
  padding: 32px;
  background-color: var(--neutral100) !important;
  border: 1px solid var(--neutral300) !important;
  ${shadow_200} !important;
  ${rounded_8} !important;
  ${smcss(
    css`
      width: 100vw !important;
      max-width: 100vw !important;
      left: 0;
    `,
  )};
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
  color: var(--textPrimary);
`;

const Close = styled(CloseSVG)`
  cursor: pointer;
  g {
    path {
      stroke: var(--textTertiary);
    }
  }
  &:hover {
    g {
      path {
        stroke: var(--textSecondary);
      }
    }
  }
`;

const Description = styled.div`
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  color: var(--textPrimary);
`;

const Connect = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const ConnectButton = styled(ButtonPrimary)`
  width: 100%;
`;

export default function ConnectWalletModal({ visible, setVisible }) {
  const dispatch = useDispatch();
  const [accounts, setAccounts] = useState([]);
  const [selectedWallet, setSelectedWallet] = useState(null);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const chain = useSelector(chainSelector);

  const onConnect = useCallback(() => {
    const account = {
      extension: selectedWallet,
      chain,
      address: selectedAccount.address,
    };
    dispatch(setAccount(account));
    setVisible(false);
  }, [dispatch, selectedWallet, selectedAccount, chain, setVisible]);

  return (
    <StyledModal open={visible} onClose={() => setVisible(false)}>
      <Header>
        <Title>Connect Wallet</Title>
        <Close onClick={() => setVisible(false)} />
      </Header>
      <Description>
        By connecting wallet, I have read and agree to doTreasury’s the terms of
        the User Agreement and Privacy Notice.
      </Description>
      {selectedWallet && accounts?.length > 0 ? (
        <Connect>
          <AccountSelect
            chain={chain}
            accounts={accounts}
            onSelect={setSelectedAccount}
          />
          <ConnectButton onClick={onConnect}>Connect</ConnectButton>
        </Connect>
      ) : (
        <WalletSelect setAccounts={setAccounts} onSelect={setSelectedWallet} />
      )}
    </StyledModal>
  );
}

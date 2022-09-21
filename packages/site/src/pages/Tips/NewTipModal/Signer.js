import { useSelector } from "react-redux";
import styled from "styled-components";
import { ReactComponent as PolkadotLogo } from "../../../components/ConnectWallet/Wallets/polkadot.svg";
import { ReactComponent as SubWalletLogo } from "../../../components/ConnectWallet/Wallets/subWallet.svg";
import { ReactComponent as TalismanLogo } from "../../../components/ConnectWallet/Wallets/talisman.svg";
import { accountSelector } from "../../../store/reducers/accountSlice";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 16px;
  gap: 16px;

  background: #FAFAFA;
  border: 1px solid #F4F4F4;
  border-radius: 4px;
`;

const ExtensionName = styled.div`
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
  color: rgba(0, 0, 0, 0.9);
`;

const Address = styled.div`
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  color: rgba(0, 0, 0, 0.3);
`;

export default function Signer() {
  const account = useSelector(accountSelector);

  let walletLogo = null;
  let walletName = "";

  switch(account?.extension) {
    case "polkadot-js": {
      walletLogo = <PolkadotLogo />;
      walletName = "Polkadot.js";
      break;
    }
    case "subwallet-js": {
      walletLogo = <SubWalletLogo />;
      walletName = "SubWallet";
      break;
    }
    case "talisman": {
      walletLogo = <TalismanLogo />;
      walletName = "Talisman";
      break;
    }
    default: break;
  }

  return (
    <Wrapper>
      {walletLogo}
      <ExtensionName>{walletName}</ExtensionName>
      <Address>{account?.address}</Address>
    </Wrapper>
  );
}

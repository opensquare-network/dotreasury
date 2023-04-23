import { useSelector } from "react-redux";
import styled from "styled-components";
import { ReactComponent as PolkadotLogo } from "../ConnectWallet/Wallets/polkadot.svg";
import { ReactComponent as SubWalletLogo } from "../ConnectWallet/Wallets/subWallet.svg";
import { ReactComponent as TalismanLogo } from "../ConnectWallet/Wallets/talisman.svg";
import Tooltip from "../Tooltip";
import { TooltipInfoText } from "../Tooltip/styled";
import { accountSelector } from "../../store/reducers/accountSlice";
import { ellipsis } from "../../utils/ellipsis";
import CouncilorTag from "./CouncilorTag";
import useCouncilMembers from "../../utils/useCouncilMembers";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 16px;
  justify-content: space-between;

  background: #FAFAFA;
  border: 1px solid #F4F4F4;
  border-radius: 4px;

  @media screen and (max-width: 600px) {
    .address {
      display: none;
    }
  }
`;

const Left = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const ExtensionName = styled.div`
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
  color: var(--textPrimary);
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
  const councilMembers = useCouncilMembers();
  const isCouncilor = councilMembers?.includes(account?.address);

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
      <Left>
        {walletLogo}
        <ExtensionName>{walletName}</ExtensionName>
        <Address className="address">
          <Tooltip
            showTooltip={true}
            tooltipContent={<TooltipInfoText>{account?.address}</TooltipInfoText>}
          >
            {ellipsis(account?.address)}
          </Tooltip>
        </Address>
      </Left>
      {isCouncilor && <CouncilorTag />}
    </Wrapper>
  );
}

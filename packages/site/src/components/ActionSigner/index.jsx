import { useSelector } from "react-redux";
import styled from "styled-components";
import Tooltip from "../Tooltip";
import { TooltipInfoText } from "../Tooltip/styled";
import { accountSelector } from "../../store/reducers/accountSlice";
import { ellipsis } from "../../utils/ellipsis";
import CouncilorTag from "./CouncilorTag";
import useCouncilMembers from "../../utils/useCouncilMembers";
import ImageWithDark from "../ImageWithDark";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 16px;
  justify-content: space-between;

  background: var(--neutral200);
  border: 1px solid var(--neutral300);
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
  color: var(--textTertiary);
`;

export default function Signer() {
  const account = useSelector(accountSelector);
  const councilMembers = useCouncilMembers();
  const isCouncilor = councilMembers?.includes(account?.address);

  let walletLogo = null;
  let walletName = "";

  switch (account?.extension) {
    case "polkadot-js": {
      walletLogo = <ImageWithDark src="/imgs/wallets/polkadot-js.svg" />;
      walletName = "Polkadot.js";
      break;
    }
    case "subwallet-js": {
      walletLogo = <ImageWithDark src="/imgs/wallets/subwallet.svg" />;
      walletName = "SubWallet";
      break;
    }
    case "talisman": {
      walletLogo = <ImageWithDark src="/imgs/wallets/talisman.svg" />;
      walletName = "Talisman";
      break;
    }
    default:
      break;
  }

  return (
    <Wrapper>
      <Left>
        {walletLogo}
        <ExtensionName>{walletName}</ExtensionName>
        <Address className="address">
          <Tooltip
            showTooltip={true}
            tooltipContent={
              <TooltipInfoText>{account?.address}</TooltipInfoText>
            }
          >
            {ellipsis(account?.address)}
          </Tooltip>
        </Address>
      </Left>
      {isCouncilor && <CouncilorTag />}
    </Wrapper>
  );
}

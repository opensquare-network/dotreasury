import { ReactComponent as PolkadotLogo } from "./polkadot.svg";
import { ReactComponent as SubWalletLogo } from "./subWallet.svg";
import { ReactComponent as TalismanLogo } from "./talisman.svg";

const Wallets = [
  {
    extensionName: "polkadot-js",
    title: "Polkadot.js",
    installUrl:
      "https://chrome.google.com/webstore/detail/polkadot%7Bjs%7D-extension/mopnmbcafieddcagagdcbnhejhlodfdd",
    logo: PolkadotLogo,
  },
  {
    extensionName: "subwallet-js",
    title: "SubWallet",
    installUrl:
      "https://chrome.google.com/webstore/detail/subwallet/onhogfjeacnfoofkfgppdlbmlmnplgbn",
    logo: SubWalletLogo,
  },
  {
    extensionName: "talisman",
    title: "Talisman",
    installUrl:
      "https://chrome.google.com/webstore/detail/talisman-wallet/fijngjgcjhjmmpcmkeiomlglpeiijkld",
    logo: TalismanLogo,
  },
];

export default Wallets;

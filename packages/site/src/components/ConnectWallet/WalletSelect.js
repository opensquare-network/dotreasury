import styled, { css } from "styled-components";
import React, { useEffect, useState } from "react";
import { web3Enable, web3FromAddress } from "@polkadot/extension-dapp";
import { useIsMounted } from "../../utils/hooks";
import { substrateWeb3Accounts } from "../../utils/extension";
import Wallets from "./Wallets";
import { ReactComponent as CaretSVG } from "./caret-right.svg";

const WalletOptions = styled.ul`
  all: unset;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const WalletOption = styled.li`
  all: unset;
  cursor: pointer;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px !important;

  box-sizing: border-box;
  border: 1px solid #dddddd;
  border-radius: 4px;

  svg.caret-right {
    display: none;
  }

  ${(props) =>
    props.installed === false &&
    css`
      cursor: not-allowed;
      pointer-events: none;
      user-select: none;
      background: #FAFAFA;
      border: 1px solid #F4F4F4;
    `}

  ${(props) =>
    props.installed === true &&
    css`
      &:hover {
        border-color: #cccccc;
        svg.caret-right {
          display: block;
        }
      }
    `}

  span.wallet-not-installed {
    font-style: normal;
    font-weight: 400;
    font-size: 12px;
    line-height: 16px;
    color: rgba(0, 0, 0, 0.3);
  }
`;

const WalletTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;

  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
  color: rgba(0, 0, 0, 0.9);
`;

export const setOtherWallet = async (address, setWallet) => {
  for (let wallet of Wallets) {
    if (window.injectedWeb3[wallet.extensionName]) {
      return;
    }
  }
  const injector = await web3FromAddress(address);
  setWallet(injector);
};

const useInjectedWeb3 = () => {
  const isMounted = useIsMounted();
  const [injectedWeb3, setInjectedWeb3] = useState(null);
  useEffect(() => {
    if (typeof window !== "undefined" && window.injectedWeb3) {
      setTimeout(() => {
        if (isMounted.current) {
          setInjectedWeb3(window.injectedWeb3);
        }
      }, 1000);
    }
  }, [isMounted]);
  return injectedWeb3;
};

const Wallet = ({ wallet, onClick, selected = false, loading = false }) => {
  const [installed, setInstalled] = useState(null);
  const injectedWeb3 = useInjectedWeb3();
  const isMounted = useIsMounted();
  const Logo = wallet.logo;

  useEffect(() => {
    // update if installed changes
    if (injectedWeb3 && isMounted.current) {
      setInstalled(!!injectedWeb3?.[wallet?.extensionName]);
    }
  }, [injectedWeb3, isMounted, wallet]);

  return (
    <WalletOption selected={selected} onClick={onClick} installed={installed}>
      <WalletTitle>
        <Logo className={wallet.title} alt={wallet.title} />
        <span className="wallet-title">{wallet.title}</span>
      </WalletTitle>
      {installed ? (
        <CaretSVG className="caret-right" />
      ) : (
        <span className="wallet-not-installed">Not installed</span>
      )}
      {/* {(loading || installed === null) && <Loading />} */}
    </WalletOption>
  );
};

export default function WalletSelect({
  setAccounts,
  onSelect = () => {},
}) {
  const isMounted = useIsMounted();
  const [waitingPermissionWallet, setWaitingPermissionWallet] = useState(null);
  const injectedWeb3 = useInjectedWeb3();

  useEffect(() => {
    if (!injectedWeb3) {
      return;
    }
    for (let wallet of Wallets) {
      if (injectedWeb3[wallet.extensionName]) {
        return;
      }
    }
    (async () => {
      await web3Enable("doTreasury");
      const extensionAccounts = await substrateWeb3Accounts();
      const accounts = extensionAccounts.map((item) => {
        const {
          address,
          meta: { name },
        } = item;
        return {
          address,
          name,
        };
      });

      if (isMounted.current) {
        setAccounts(accounts);
      }
    })();
  }, [injectedWeb3, isMounted, setAccounts]);

  const loadAccounts = (selectedWallet) => {
    (async () => {
      setAccounts(null);
      const extension = window?.injectedWeb3?.[selectedWallet];
      if (!extension) {
        return;
      }
      try {
        setWaitingPermissionWallet(selectedWallet);
        const wallet = await extension.enable("doTreasury");
        const extensionAccounts = await wallet.accounts?.get();
        if (isMounted.current) {
          setAccounts(extensionAccounts);
        }
      } catch (e) {
        console.error(e);
      } finally {
        if (isMounted.current) {
          setWaitingPermissionWallet(null);
        }
      }
    })();
  };

  return (
    <WalletOptions>
      {Wallets.map((wallet, index) => {
        return (
          <Wallet
            key={index}
            wallet={wallet}
            onClick={() => {
              loadAccounts(wallet.extensionName);
              onSelect && onSelect(wallet.extensionName);
            }}
            loading={wallet.extensionName === waitingPermissionWallet}
          />
        );
      })}
    </WalletOptions>
  );
}

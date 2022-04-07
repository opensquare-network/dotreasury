import { web3Accounts } from "@polkadot/extension-dapp";

export async function polkadotWeb3Accounts() {
  const extensionAccounts = await web3Accounts();
  return extensionAccounts.filter((acc) => acc.type !== "ethereum");
}

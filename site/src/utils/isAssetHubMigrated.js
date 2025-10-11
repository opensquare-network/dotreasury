import { currentChainSettings } from "./chains";

export default function isAssetHubMigrated() {
  return !!currentChainSettings.assethubMigration;
}

import ClaimButtonBase from "./ClaimButtonBase";

export default function ClaimButton({ bounty, onFinalized }) {
  return (
    <ClaimButtonBase
      bounty={bounty}
      onFinalized={onFinalized}
      newClaimTx={
        (api) => api.tx.bounties.claimBounty(bounty.bountyIndex)
      }
    />
  );
}

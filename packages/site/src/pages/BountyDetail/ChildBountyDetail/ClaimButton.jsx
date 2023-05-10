import ClaimButtonBase from "../ClaimButtonBase";

export default function ClaimButton({ childBounty, onFinalized }) {
  return (
    <ClaimButtonBase
      bounty={childBounty}
      onFinalized={onFinalized}
      newClaimTx={
        (api) => api.tx.childBounties.claimChildBounty(childBounty.parentBountyId, childBounty.index)
      }
    />
  );
}

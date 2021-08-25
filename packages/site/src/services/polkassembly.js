import { networkFromSymbol } from "../utils";
import Api from "./api";
import { CHAINS } from "../constants";

const chainStorageKey = "dotreasury-current-chain";
const INITIAL_CHAIN = localStorage.getItem(chainStorageKey) || CHAINS.POLKADOT;
const chain = networkFromSymbol(INITIAL_CHAIN);

class PolkassemblyApi extends Api {
  async getMotionUrl(motionIndex) {
    if (motionIndex === undefined || motionIndex === null) {
      return null;
    }

    const { result } = await this.fetch(
      "/v1/graphql",
      {},
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          operationName: "MotionPostAndComments",
          variables: { id: motionIndex },
          query: `
          query MotionPostAndComments($id: Int!) {
            posts(where: {
              onchain_link: { onchain_motion_id: { _eq: $id } }
            }) {
              __typename
            }
          }`,
        }),
      }
    );

    if (result?.data?.posts?.length > 0) {
      return `https://${chain}.polkassembly.io/motion/${motionIndex}`;
    } else {
      return null;
    }
  }

  async getProposalUrl(proposalIndex) {
    if (proposalIndex === undefined || proposalIndex === null) {
      return null;
    }

    const { result } = await this.fetch(
      "/v1/graphql",
      {},
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          operationName: "TreasuryProposalPostAndComments",
          variables: { id: proposalIndex },
          query: `
          query TreasuryProposalPostAndComments($id: Int!) {
            posts(where: {onchain_link: {onchain_treasury_proposal_id: {_eq: $id}}}) {
              __typename
            }
          }`,
        }),
      }
    );

    if (result?.data?.posts?.length > 0) {
      return `https://${chain}.polkassembly.io/treasury/${proposalIndex}`;
    } else {
      return null;
    }
  }

  async getTipUrl(tipHash) {
    if (tipHash === undefined || tipHash === null) {
      return null;
    }

    const { result } = await this.fetch(
      "/v1/graphql",
      {},
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          operationName: "TipPostAndComments",
          variables: { hash: tipHash },
          query: `
          query TipPostAndComments($hash: String!) {
            posts(where: {onchain_link: {onchain_tip_id: {_eq: $hash}}}) {
              __typename
            }
          }`,
        }),
      }
    );

    if (result?.data?.posts?.length > 0) {
      return `https://${chain}.polkassembly.io/tip/${tipHash}`;
    } else {
      return null;
    }
  }
}

export default new PolkassemblyApi(`https://${chain}.polkassembly.io`);

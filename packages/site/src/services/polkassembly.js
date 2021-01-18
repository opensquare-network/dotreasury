import Api from "./api";

class PolkassemblyApi extends Api {
  async getMotionUrl(motionIndex) {
    const { result } = await this.fetch("/v1/graphql", {}, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
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
    });

    if (result?.data?.posts?.length > 0) {
      return `https://kusama.polkassembly.io/motion/${motionIndex}`;
    } else {
      return null;
    }
  }

  async getProposalUrl(proposalIndex) {
    const { result } = await this.fetch("/v1/graphql", {}, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
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
    });

    if (result?.data?.posts?.length > 0) {
      return `https://kusama.polkassembly.io/treasury/${proposalIndex}`;
    } else {
      return null;
    }
  }
}

export default new PolkassemblyApi("https://kusama.polkassembly.io");

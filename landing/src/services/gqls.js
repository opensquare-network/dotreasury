import { gql } from "@apollo/client";

export const GET_TREASURIES = gql`
  query GetTreasuries {
    treasuries {
      balance
      balanceUpdateAt
      chain
      price
      priceUpdateAt
    }
  }
`;

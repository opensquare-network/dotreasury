import styled from "styled-components";
import ExternalLink from "../../components/ExternalLink";
import ImageButton from "../Timeline/ImageButton";

const List = styled.ul`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export default function ProposalInfoLinkList({ id, chain, type, indexer }) {
  const subsquareBaseUrl = `https://${chain}.subsquare.io`;
  const polkassemblyBaseUrl = `https://${chain}.polkassembly.io`;

  let subsquareUrl = "";
  let polkassemblyUrl = "";

  if (type === "tip") {
    subsquareUrl =
      subsquareBaseUrl + `/treasury/tip/${indexer?.blockHeight}_${id}`;
    polkassemblyUrl = polkassemblyBaseUrl + `/tip/${id}`;
  } else if (type === "proposal") {
    subsquareUrl = subsquareBaseUrl + `/treasury/proposal/${id}`;
    polkassemblyUrl = polkassemblyBaseUrl + `/treasury/${id}`;
  }

  return (
    <List>
      <li>
        <ExternalLink href={polkassemblyUrl}>
          <ImageButton src="/imgs/polkassembly-logo.svg" />
        </ExternalLink>
      </li>
      <li>
        <ExternalLink href={subsquareUrl}>
          <ImageButton src="/imgs/subsquare-logo.svg" />
        </ExternalLink>
      </li>
    </List>
  );
}

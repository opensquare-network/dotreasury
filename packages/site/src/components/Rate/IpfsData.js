import styled from "styled-components";
import ExternalLink from "../ExternalLink";

const DataIcon = styled.div`
  width: 16px;
  height: 16px;
  background: url("/imgs/ipfs-data.svg");
  :hover {
    background: url("/imgs/ipfs-data-hover.svg");
  }
`;


export default function IpfsData({ url }) {
  return (
    <ExternalLink href={url}>
      <DataIcon />
    </ExternalLink>
  )
}

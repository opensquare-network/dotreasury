import styled from "styled-components";
import ExternalLink from "../ExternalLink";

const DataIcon = styled.div`
  width: 16px;
  height: 16px;
  background-size: 16px;
  background-image: url(${(p) =>
    p.theme.dark
      ? "/imgs/ipfs-logo-inactive-dark.svg"
      : "/imgs/ipfs-logo-inactive.svg"});
  :hover {
    background-image: url(${(p) =>
      p.theme.dark ? "/imgs/ipfs-logo-dark.svg" : "/imgs/ipfs-logo.svg"});
  }
`;

const DataIconDisabled = styled.div`
  width: 16px;
  height: 16px;
  background-image: url(${(p) =>
    p.theme.dark
      ? "/imgs/ipfs-logo-inactive-dark.svg"
      : "/imgs/ipfs-logo-inactive.svg"});
  background-size: 16px;
`;

export default function IpfsData({ url }) {
  return !url ? (
    <DataIconDisabled />
  ) : (
    <ExternalLink href={url}>
      <DataIcon />
    </ExternalLink>
  );
}

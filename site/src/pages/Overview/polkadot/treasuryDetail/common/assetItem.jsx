import ExternalLinkOrigin from "../../../../../components/ExternalLink";
import { p_12_medium } from "../../../../../styles/text";
import AssetWrapper from "./assetWrapper";
import styled from "styled-components";

export const ExternalLink = styled(ExternalLinkOrigin)`
  ${p_12_medium}
  color: var(--textSecondary);
  &:hover {
    color: var(--textSecondary);
    text-decoration: underline;
  }
`;

export default function AssetItem({ title, titleLink, children }) {
  return (
    <AssetWrapper>
      <ExternalLink
        href={titleLink}
        externalIcon
        externalIconColor="textSecondary"
      >
        {title}
      </ExternalLink>

      {children}
    </AssetWrapper>
  );
}

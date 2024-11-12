import styled from "styled-components";
import { p_12_medium, p_14_semibold } from "../../../../styles/text";
import { text_primary, text_secondary } from "../../../../styles/tailwindcss";
import Symbol from "./Symbol";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 12px;
  gap: 8px;
  border-radius: 4px;
  background: var(--neutral200);
`;

const AssetList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const AssetListItemWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  ${p_14_semibold}
  ${text_primary}
`;

const TitleWrapper = styled.a`
  display: flex;
  gap: 4px;
  ${p_12_medium}
  ${text_secondary}
  :hover {
    ${text_secondary}
  }
`;

function Title({ label, href }) {
  return (
    <TitleWrapper href={href} target="_blank">
      <span>{label}</span>
      <span>↗</span>
    </TitleWrapper>
  );
}

function AssetListItem({ symbol, value }) {
  return (
    <AssetListItemWrapper>
      <Symbol symbol={symbol} />
      <div>{value}</div>
    </AssetListItemWrapper>
  );
}

export default function AddressAssetBlock({ label, href, assets = [] }) {
  return (
    <Wrapper>
      <Title label={label} href={href} />
      <AssetList>
        {assets.map(({ symbol, value }) => (
          <AssetListItem key={symbol} symbol={symbol} value={value} />
        ))}
      </AssetList>
    </Wrapper>
  );
}

import styled from "styled-components";
import ValueDisplay from "../../../../../components/ValueDisplay";
import { p_14_medium, p_14_semibold } from "../../../../../styles/text";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: between;
  ${p_14_semibold}
`;

const SymbolWrapper = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  gap: 8px;
`;

const ValueWrapper = styled.div`
  width: 100%;
  text-align: right;
  ${p_14_medium}
`;

export default function AssetValueDisplay({
  symbol = "",
  value,
  precision,
  fixed = 2,
}) {
  return (
    <Wrapper>
      <SymbolWrapper>
        <img src={`/imgs/asset-${symbol?.toLowerCase()}.svg`} alt={symbol} />
        {symbol?.toUpperCase()}
      </SymbolWrapper>

      <ValueWrapper>
        <ValueDisplay value={value} precision={precision} fixed={fixed} />
      </ValueWrapper>
    </Wrapper>
  );
}

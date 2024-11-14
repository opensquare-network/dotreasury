import styled from "styled-components";
import ValueDisplay from "../../../../../components/ValueDisplay";
import { p_14_medium, p_14_semibold } from "../../../../../styles/text";
import SkeletonBar from "../../../../../components/skeleton/bar";
import TooltipOrigin from "../../../../../components/Tooltip";

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
  display: flex;
  align-items: center;
  justify-content: flex-end;
  ${p_14_medium}
`;

const Tooltip = styled(TooltipOrigin)`
  display: inline-block;
`;

export default function AssetValueDisplay({
  symbol = "",
  value,
  precision,
  fixed = 2,
  isLoading,
  valueTooltipContent,
}) {
  let valueContent = (
    <ValueDisplay value={value} precision={precision} fixed={fixed} />
  );
  if (valueTooltipContent) {
    valueContent = (
      <Tooltip tooltipContent={valueTooltipContent}>{valueContent}</Tooltip>
    );
  }

  return (
    <Wrapper>
      <SymbolWrapper>
        <img src={`/imgs/asset-${symbol?.toLowerCase()}.svg`} alt={symbol} />
        {symbol?.toUpperCase()}
      </SymbolWrapper>

      <ValueWrapper>
        {isLoading ? (
          <SkeletonBar width={80} height={16} />
        ) : (
          <div>{valueContent}</div>
        )}
      </ValueWrapper>
    </Wrapper>
  );
}

import { isNil } from "lodash-es";
import SortableSingleFiatValue from "../../../components/SortableValue/SortableSingleFiatValue";
import { currentChainSettings } from "../../../utils/chains";
import styled from "styled-components";
import { space_y } from "../../../styles/tailwindcss";
import { p_12_medium } from "../../../styles/text";
import { useTableColumns } from "../../../components/shared/useTableColumns";
import useSort from "../../../hooks/useSort";
import ValueDisplay from "../../../components/ValueDisplay";

const ValueCellWrapper = styled.div`
  ${space_y(2)}
`;
const ValueDisplayWrapper = styled.div`
  color: var(--textPrimary);
`;
const ValueDisplayFiatWrapper = styled.div`
  ${p_12_medium}
`;

export function useTreasurySpendsSortByValueColumn() {
  const { value } = useTableColumns({});
  const { sortField, setSortField, sortDirection, setSortDirection } =
    useSort();

  return {
    ...value,
    cellClassName: "treasury-spends-value-cell",
    title: (
      <SortableSingleFiatValue
        sortField={sortField}
        setSortField={setSortField}
        sortDirection={sortDirection}
        setSortDirection={setSortDirection}
      />
    ),
    cellRender(_, item) {
      if (isNil(item.value)) {
        return "--";
      }

      let asset = item?.assetType;
      if (!asset) {
        asset = {
          decimals: currentChainSettings.decimals,
          symbol: currentChainSettings.symbol,
        };
      }

      return (
        <ValueCellWrapper>
          <ValueDisplayWrapper>
            <ValueDisplay value={item.value} precision={asset?.decimals} />{" "}
            {asset.symbol}
          </ValueDisplayWrapper>
          {!!item.fiatValue && (
            <ValueDisplayFiatWrapper>
              <ValueDisplay value={item.fiatValue} prefix="$" />
            </ValueDisplayFiatWrapper>
          )}
        </ValueCellWrapper>
      );
    },
  };
}

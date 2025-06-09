import styled from "styled-components";
import { space_y } from "../../../styles/tailwindcss";
import { useTableColumns } from "../../../components/shared/useTableColumns";
import ValueDisplay from "../../../components/ValueDisplay";
import getAssetByMeta from "../../../utils/getAssetByMeta";

const ValueCellWrapper = styled.div`
  ${space_y(2)}
`;
const ValueDisplayWrapper = styled.div`
  color: var(--textPrimary);
`;

export function useTreasurySpendsSortByValueColumn() {
  const { value } = useTableColumns({});

  return {
    ...value,
    cellClassName: "treasury-spends-value-cell",
    key: "meta",

    cellRender(_, item) {
      const value = item.meta.amount;
      const asset = getAssetByMeta(item.meta);

      return (
        <ValueCellWrapper>
          <ValueDisplayWrapper>
            <ValueDisplay value={value} precision={asset?.decimals} />{" "}
            {asset?.symbol}
          </ValueDisplayWrapper>
        </ValueCellWrapper>
      );
    },
  };
}

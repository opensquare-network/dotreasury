import styled from "styled-components";
import AssetInput from "../../../components/AssetInput";
import User from "../../../components/User";
import MinusButton from "../../../components/MinusButton";
import { Image } from "semantic-ui-react";
import { Wrapper, Loading, NoData } from "./styled";

const StyledTable = styled.table`
  background: #F4F4F4;
  width: 100%;
  border-spacing: 0px;

  th {
    background: #FAFAFA;
    padding: 12px 16px;
    border-bottom: 1px solid #F4F4F4;

    font-weight: 400;
    font-size: 12px;
    line-height: 16px;
    color: rgba(0, 0, 0, 0.3);
  }

  tbody {
    tr {
      td {
        background: #FFFFFF;
        padding: 12px 16px;
      }

      &:not(:last-child) {
        td {
          border-bottom: 1px solid #F4F4F4;
        }
      }
    }
  }
`;

const Beneficiary = styled.td`
  max-width: 176px;
  overflow: hidden;
`;

const Reason = styled.td`
  word-break: break-all;
`;

const Tip = styled.td`
  white-space: nowrap;
`;

export default function TipsTableForPC({
  symbol,
  isLoading,
  tipList,
  tipValues,
  removeTip,
  updateTipValue
}) {
  const loadingTippings = (
    <tr>
      <td colSpan="4">
        <Loading>
          <Image src="/imgs/loading.svg" />
        </Loading>
      </td>
    </tr>
  );

  const noData = (
    <tr>
      <td colSpan="4">
        <NoData>No data</NoData>
      </td>
    </tr>

  );

  const tippingRows = (
    tipList?.map((tip) => (
      <tr key={tip.hash}>
        <td>
          <MinusButton onClick={() => removeTip(tip.hash)} />
        </td>
        <Beneficiary>
          <User address={tip.beneficiary} />
        </Beneficiary>
        <Reason>{tip.reason}</Reason>
        <Tip>
          <AssetInput
            defaultValue={tipValues[tip.hash]}
            symbol={symbol}
            onChange={(e) => updateTipValue(tip.hash, e.target.value)}
          />
        </Tip>
      </tr>
    ))
  );

  return (
    <Wrapper>
      <StyledTable>
        <thead>
          <tr>
            <th></th>
            <th>Beneficiary</th>
            <th>Reason</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            loadingTippings
          ) : (
            tipList?.length > 0 ? tippingRows : noData
          )}
        </tbody>
      </StyledTable>
    </Wrapper>
  );
}

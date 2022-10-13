import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import AssetInput from "../../../components/AssetInput";
import User from "../../../components/User";
import { chainSymbolSelector } from "../../../store/reducers/chainSlice";
import { getPrecision, toPrecision } from "../../../utils";
import MinusButton from "../../../components/MinusButton";
import { Image } from "semantic-ui-react";

const Wrapper = styled.div`
  display: block;
  max-height: 300px;

  border: 1px solid #F4F4F4;
  border-radius: 4px;
  overflow-y: auto;

  ::-webkit-scrollbar {
    display: block;
    width: 6px;
  }
  ::-webkit-scrollbar-track {
    background-color: rgba(0,0,0,0);
  }
  ::-webkit-scrollbar-thumb {
    background-color: #CCCCCC;
    border-radius: 3px;
  }
`;

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

const Loading = styled.div`
  display: flex;
  width: 100%;
  padding: 48px 0;
  justify-content: center;
`;

const NoData = styled.div`
  display: flex;
  width: 100%;
  padding: 20px 0;
  justify-content: center;
`;


export default function useTipsTable({ tips, isLoading }) {
  const [tipList, setTipList] = useState();
  const symbol = useSelector(chainSymbolSelector);
  const precision = getPrecision(symbol);
  const [tipValues, setTipValues] = useState({});

  useEffect(() => {
    setTipList(tips);

    const tipValues = tips.reduce((result, tip) => (
      {
        ...result,
        [tip.hash]: toPrecision(tip.medianValue || 0, precision, false)
      }), {})
    setTipValues(tipValues);
  }, [tips, precision]);

  const updateTipValue = useCallback((hash, tipValue) => {
    setTipValues({
      ...tipValues,
      [hash]: tipValue
    });
  }, [tipValues]);

  const removeTip = useCallback((hash) => {
    setTipList(tipList.filter(tip => tip.hash !== hash));
    const { [hash]: _, ...newTipValues } = tipValues;
    setTipValues(newTipValues)
  }, [tipList, tipValues]);

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

  const Component = (
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

  return {
    Component,
    tipValues,
    setTipValues,
  }
}

import styled from "styled-components";
import AssetInput from "../../../components/AssetInput";
import User from "../../../components/User";
import MinusButton from "../../../components/MinusButton";
import { Image } from "semantic-ui-react";
import { Flex } from "../../../components/styled";
import { Wrapper, Loading, NoData } from "./styled";

const StyledTipList = styled.table`
  width: 100%;
  border-spacing: 0px;

  tbody {
    tr {
      &:not(:last-child) {
        td {
          border-bottom: 1px solid var(--neutral300);
        }
      }
    }
  }
`;

const StyledTipListItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
`;

const TipHead = styled(Flex)`
  justify-content: space-between;
`;

const Reason = styled.div`
  word-break: break-all;
`;

const Tip = styled.div``;

function TipList({ children }) {
  return (
    <StyledTipList>
      <tbody>{children}</tbody>
    </StyledTipList>
  );
}

function TipListItem({ children }) {
  return (
    <tr>
      <td>
        <StyledTipListItem>{children}</StyledTipListItem>
      </td>
    </tr>
  );
}

export default function TipsTableForMobile({
  symbol,
  isLoading,
  tipList,
  tipValues,
  removeTip,
  updateTipValue,
}) {
  const loadingTippings = (
    <Loading>
      <Image src="/imgs/loading.svg" />
    </Loading>
  );

  const noData = <NoData>No data</NoData>;

  const tippingRows = (
    <TipList>
      {tipList?.map((tip) => (
        <TipListItem key={tip.hash}>
          <TipHead>
            <User address={tip.beneficiary} />
            <MinusButton onClick={() => removeTip(tip.hash)} />
          </TipHead>
          <Reason>{tip.reason}</Reason>
          <Tip>
            <AssetInput
              defaultValue={tipValues[tip.hash]}
              symbol={symbol}
              onChange={(e) => updateTipValue(tip.hash, e.target.value)}
            />
          </Tip>
        </TipListItem>
      ))}
    </TipList>
  );

  return (
    <Wrapper>
      {isLoading ? loadingTippings : tipList?.length > 0 ? tippingRows : noData}
    </Wrapper>
  );
}

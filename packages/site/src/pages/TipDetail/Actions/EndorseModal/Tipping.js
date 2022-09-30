import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import Balance from "../../../../components/Balance";
import useApi from "../../../../hooks/useApi";
import { accountSelector } from "../../../../store/reducers/accountSlice";
import { chainSymbolSelector } from "../../../../store/reducers/chainSlice";
import { isSameAddress } from "../../../../utils";

const Wrapper = styled.div`
  display: flex;
  background: #FAFAFA;
  border-radius: 4px;
  padding: 8px 16px;

  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  text-align: center;
`;

const NoTipping = styled(Wrapper)`
  justify-content: center;
  color: rgba(0, 0, 0, 0.3);
`;

const TippingContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const TippingValue = styled(Wrapper)`
  justify-content: space-between;
  color: rgba(0, 0, 0, 0.9);
`;

const Message = styled.div`
  display: flex;
  padding: 8px 16px;

  background: #FFF0F3;
  border-radius: 4px;

  font-weight: 400;
  font-size: 14px;
  line-height: 20px;

  justify-content: center;
  color: #F23252;
`;

export default function Tipping({ tipDetail }) {
  const account = useSelector(accountSelector);
  const symbol = useSelector(chainSymbolSelector);
  const [tipValue, setTipValue] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const api = useApi();
  const tipHash = tipDetail?.hash;

  useEffect(() => {
    if (!api) {
      return;
    }

    if (!account) {
      return;
    }

    if (!tipHash) {
      return;
    }

    setIsLoading(true);
    api.query.tips.tips(tipHash).then((data) => {
      const { tips } = data.toJSON();
      setIsLoading(false);
      setTipValue(null);
      for (const [address, value] of tips) {
        if (isSameAddress(address, account?.address)) {
          setTipValue(value);
        }
      }
    });
  }, [api, tipHash, account]);

  return (
    (isLoading || tipValue === null)  ? (
      <NoTipping>No tipping record</NoTipping>
    ) : (
      <TippingContainer>
        <TippingValue>
          <span>Tipping</span>
          <Balance value={tipValue} currency={symbol} />
        </TippingValue>
        <Message>Resubmiting the tip will overwrite the current tipping record</Message>
      </TippingContainer>
    )
  );
}

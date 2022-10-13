import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import useApi from "../../../../hooks/useApi";
import { accountSelector } from "../../../../store/reducers/accountSlice";
import { chainSymbolSelector } from "../../../../store/reducers/chainSlice";
import { getPrecision, isSameAddress, toPrecision } from "../../../../utils";
import Loading from "../../../../components/LoadingCircle";
import { HintMessage } from "../../../../components/styled";

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

export default function Tipping({ tipDetail }) {
  const account = useSelector(accountSelector);
  const symbol = useSelector(chainSymbolSelector);
  const [tipValue, setTipValue] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const api = useApi();
  const tipHash = tipDetail?.hash;
  const precision = toPrecision(tipValue, getPrecision(symbol), false);
  const localePrecision = Number(precision).toLocaleString();

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

    setTipValue(null);
    setIsLoading(true);
    api.query.tips.tips(tipHash).then((data) => {
      const { tips } = data.toJSON();
      setIsLoading(false);
      for (const [address, value] of tips) {
        if (isSameAddress(address, account?.address)) {
          setTipValue(value);
        }
      }
    });
  }, [api, tipHash, account]);

  return (
    isLoading ? (
      <NoTipping>
        <Loading size={20} />
      </NoTipping>
    ) : (
      tipValue === null ? (
        <NoTipping>No tipping record</NoTipping>
      ) : (
        <TippingContainer>
          <TippingValue>
            <span>Tipping</span>
            <span>{localePrecision} {symbol}</span>
          </TippingValue>
          <HintMessage>Resubmiting the tip will overwrite the current tipping record</HintMessage>
        </TippingContainer>
      )
    )
  );
}

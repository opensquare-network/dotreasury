import styled from "styled-components";
import { useSelector } from "react-redux";
import { chainSymbolSelector } from "../../store/reducers/chainSlice";
import { getPrecision } from "../../utils";
import { p_12_normal, p_14_medium } from "../../styles/text";
import ValueDisplay from "../ValueDisplay";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const Head = styled.span`
  ${p_14_medium}
  color: var(--textPrimaryContrast);
`;

const Text = styled.div`
  white-space: nowrap;
  ${p_12_normal}
  color: var(--textSecondaryContrast);
`;

export default function VoteTooltip({ ayes, nays, ayesPercent, naysPercent }) {
  const symbol = useSelector(chainSymbolSelector);
  const precision = getPrecision(symbol);

  return (
    <Wrapper>
      <Head>Ayes</Head>
      <Text>
        <ValueDisplay value={ayes} precision={precision} /> {symbol} (
        {ayesPercent}%)
      </Text>
      <Head>Nays</Head>
      <Text>
        <ValueDisplay value={nays} precision={precision} /> {symbol} (
        {naysPercent}%)
      </Text>
    </Wrapper>
  );
}

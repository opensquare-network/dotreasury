import styled from "styled-components";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const SymbolIcon = {
  DOT: "dot.svg",
  USDt: "usdt.svg",
  USDC: "usdc.svg",
  MYTH: "myth.svg",
};

export default function Symbol({ symbol }) {
  const src = SymbolIcon[symbol];
  return (
    <Wrapper>
      {src && <img src={`/imgs/symbols/${SymbolIcon[symbol]}`} alt={symbol} />}
      <span>{symbol}</span>
    </Wrapper>
  );
}

import styled from "styled-components";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

function SymbolIcon({ symbol }) {
  return null;
}

export default function Symbol({ symbol }) {
  return (
    <Wrapper>
      <SymbolIcon symbol={symbol} />
      <span>{symbol}</span>
    </Wrapper>
  );
}

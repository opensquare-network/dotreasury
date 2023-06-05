import styled from "styled-components";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;

  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;

  color: #ffffff;
`;

const Item = styled.div`
  display: flex;
  flex-direction: column;
`;

const Title = styled.div`
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
`;

const Marker = styled.span`
  background: ${(p) => p.backgroundColor};
  border-color: ${(p) => p.borderColor};
  border-width: 2px;
  margin-right: 6px;
  height: 10px;
  width: 10px;
  display: inline-block;
`;

const Footer = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 18px;
`;

export default function MyTooltip({ tooltip, symbol }) {
  const titleLines = tooltip.title || [];

  const title = titleLines.map((text, i) => <Title key={i}>{text}</Title>);

  const items = tooltip.dataPoints.map((item, i) => {
    if (item.dataset.label === "barBg") return null;

    const colors = tooltip.labelColors[i];

    const count = item.dataset.counts[item.dataIndex];
    const fiat = item.dataset.fiats[item.dataIndex];

    return (
      <Item key={i}>
        <span>
          <Marker {...colors} />
          <span>
            {item.dataset.label} ({count})
          </span>
        </span>
        {count > 0 && (
          <span style={{ marginLeft: "18px" }}>
            ≈{item.raw.toFixed(3).toLocaleString()} {symbol} (≈$
            {fiat.toFixed(0).toLocaleString()})
          </span>
        )}
      </Item>
    );
  });

  const hasFooter = tooltip.dataPoints.some((item) => item.dataset.label !== "barBg" && item.raw > 0);

  const footer = (
    <Footer>
      <span>---</span>
      <span>Fiat value is calculated by award time</span>
    </Footer>
  );

  return (
    <Wrapper>
      {title}
      {items}
      {hasFooter && footer}
    </Wrapper>
  );
}

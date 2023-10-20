import styled from "styled-components";
import { p_12_normal } from "../../../styles/text";
import { Fragment } from "react";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;

  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;

  color: var(--textPrimaryContrast);
`;

const Item = styled.div`
  display: flex;
  justify-content: space-between;
  ${p_12_normal};
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

export default function MyTooltip({
  tooltip,
  symbol,
  groupSeparateLabels = [],
}) {
  const titleLines = tooltip.title || [];

  const title = titleLines.map((text, i) => <Title key={i}>{text}</Title>);

  const items = tooltip.dataPoints.map((item, i) => {
    if (item.dataset.label === "barBg") return null;

    const colors = tooltip.labelColors[i];

    const value = Math.abs(item.raw).toFixed(item.raw > 0 ? 3 : 0);

    const count = item.dataset.counts?.[item.dataIndex];
    const fiat = item.dataset.fiats?.[item.dataIndex];

    return (
      <Fragment key={i}>
        {groupSeparateLabels.includes(item.dataset.label) && <div>---</div>}

        <Item>
          <div style={{ display: "flex", alignItems: "baseline" }}>
            <Marker {...colors} />
            <div>
              {item.dataset.label} {count > 0 && ` (${count})`}
            </div>
          </div>
          <div style={{ position: "relative", top: -0.5, textAlign: "right" }}>
            <div>
              ≈{Number(value).toLocaleString()} {symbol}
            </div>
            {count > 0 && (
              <div>≈${Number(fiat.toFixed(0)).toLocaleString()}</div>
            )}
          </div>
        </Item>
      </Fragment>
    );
  });

  const hasFooter = tooltip.dataPoints.some(
    (item) => item.dataset.label !== "barBg" && item.raw > 0,
  );

  const footer = (
    <div>
      <div>---</div>
      <div>Fiat value is calculated by award time</div>
    </div>
  );

  return (
    <Wrapper>
      {title}
      {items}
      {hasFooter && footer}
    </Wrapper>
  );
}

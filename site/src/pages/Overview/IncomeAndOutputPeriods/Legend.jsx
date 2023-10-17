import styled, { css } from "styled-components";

const Wrapper = styled.div`
  display: flex;
  column-gap: 16px;
  row-gap: 8px;
  flex-wrap: wrap;
`;

const LegendItem = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;

  color: var(--textPrimary);

  ${(p) =>
    !p.enabled &&
    css`
      color: var(--textDisable) !important;

      ${LegendMark} {
        background: var(--textDisable) !important;
      }
    `}
`;

const LegendMark = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 3px;
  background: ${(p) => p.color};
`;

export default function IncomeAndSpendPeriodsLegend({
  incomeLegends,
  setIncomeLegends,
  outputLegends,
  setOutputLegends,
}) {
  const onIncomeLegendClick = (index) => {
    const newIncomeLegends = [...incomeLegends];
    newIncomeLegends[index].enabled = !newIncomeLegends[index].enabled;
    setIncomeLegends(newIncomeLegends);
  };

  const onSpendLegendClick = (index) => {
    const newSpendLegends = [...outputLegends];
    newSpendLegends[index].enabled = !newSpendLegends[index].enabled;
    setOutputLegends(newSpendLegends);
  };

  return (
    <Wrapper>
      {outputLegends.map((legend, index) => (
        <LegendItem
          key={legend.label}
          enabled={legend.enabled}
          onClick={() => onSpendLegendClick(index)}
        >
          <LegendMark color={legend.color} />
          <span>{legend.label}</span>
        </LegendItem>
      ))}
      {incomeLegends.map((legend, index) => (
        <LegendItem
          key={legend.label}
          enabled={legend.enabled}
          onClick={() => onIncomeLegendClick(index)}
        >
          <LegendMark color={legend.color} />
          <span>{legend.label}</span>
        </LegendItem>
      ))}
    </Wrapper>
  );
}

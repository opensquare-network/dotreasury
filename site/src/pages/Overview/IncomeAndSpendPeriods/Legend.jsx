import styled, { css } from "styled-components";
import { smcss } from "../../../styles/responsive";

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Group = styled.div`
  display: flex;
  gap: 16px;
  flex: 1;

  ${smcss(css`
    flex-direction: column;
  `)}
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
  spendLegends,
  setSpendLegends,
}) {
  const onIncomeLegendClick = (index) => {
    const newIncomeLegends = [...incomeLegends];
    newIncomeLegends[index].enabled = !newIncomeLegends[index].enabled;
    setIncomeLegends(newIncomeLegends);
  };

  const onSpendLegendClick = (index) => {
    const newSpendLegends = [...spendLegends];
    newSpendLegends[index].enabled = !newSpendLegends[index].enabled;
    setSpendLegends(newSpendLegends);
  };

  return (
    <Wrapper>
      <Group>
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
      </Group>
      <Group>
        {spendLegends.map((legend, index) => (
          <LegendItem
            key={legend.label}
            enabled={legend.enabled}
            onClick={() => onSpendLegendClick(index)}
          >
            <LegendMark color={legend.color} />
            <span>{legend.label}</span>
          </LegendItem>
        ))}
      </Group>
    </Wrapper>
  );
}

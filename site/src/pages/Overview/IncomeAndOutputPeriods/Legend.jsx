import styled, { css } from "styled-components";
import { p_14_semibold } from "../../../styles/text";

const Wrapper = styled.div`
  display: flex;
  column-gap: 24px;
  row-gap: 12px;
  flex-wrap: wrap;
`;

const LegendGroup = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 8px;
`;
const LegendTitle = styled.p`
  margin: 0;
  ${p_14_semibold};
  color: var(--textPrimary);
`;
const LegendItemWrapper = styled.div`
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
      <LegendGroup>
        <LegendTitle>Output</LegendTitle>
        <LegendItemWrapper>
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
        </LegendItemWrapper>
      </LegendGroup>
      <LegendGroup>
        <LegendTitle>Income</LegendTitle>
        <LegendItemWrapper>
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
        </LegendItemWrapper>
      </LegendGroup>
    </Wrapper>
  );
}

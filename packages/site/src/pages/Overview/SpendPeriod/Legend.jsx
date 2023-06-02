import styled, { css } from "styled-components";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 9px;
  min-width: 276px;
`;

const LegendItem = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 8px 12px;
  gap: 11.5px;

  background: #FAFAFA;
  border-radius: 4px;

  ${p => !p.enabled && css`
    color: var(--textDisable) !important;
    > div {
      background: var(--textDisable) !important;
    }
  `}
`;

const LegendMark = styled.div`
  width: 9px;
  height: 9px;
  border-radius: 2px;
  background: ${p => p.color};
`;

export default function Legend({ legends, setLegends }) {
  const onLegendClick = (index) => {
    const newLegends = [...legends];
    newLegends[index].enabled = !newLegends[index].enabled;
    setLegends(newLegends);
  };

  return (
    <Wrapper>
      {legends.map((legend, index) => (
        <LegendItem key={legend.label} enabled={legend.enabled} onClick={() => onLegendClick(index)}>
          <LegendMark color={legend.color} />
          <span>{legend.label}</span>
        </LegendItem>
      ))}
    </Wrapper>
  );
}

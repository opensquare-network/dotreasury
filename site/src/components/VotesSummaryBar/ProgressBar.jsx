import styled from "styled-components";

const Wrapper = styled.div`
  display: flex;
  flex-grow: 1;
  height: 3px;
  border-radius: 4px;
  overflow: hidden;
`;

const AyesBar = styled.div`
  background-color: var(--green500);
`;

const NaysBar = styled.div`
  background-color: var(--red500);
`;

export default function ProgressBar({ ayesPercent, naysPercent }) {
  return (
    <Wrapper>
      <AyesBar style={{ width: `${ayesPercent}%` }} />
      <NaysBar style={{ width: `${naysPercent}%` }} />
    </Wrapper>
  );
}

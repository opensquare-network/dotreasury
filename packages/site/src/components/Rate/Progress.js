import styled from "styled-components";

const Wrapper = styled.div`
  height: 24px;
  display: flex;
  align-items: center;
  flex-grow: 1;
`;

const Background = styled.div`
  width: 100%;
  height: 6px;
  background: var(--pink100);
  border-radius: 6px;
  overflow: hidden;
  position: relative;
`;

const Bar = styled.div`
  height: 6px;
  left: 0;
  top: 0;
  background: var(--pink500);
  width: ${(p) => p.percent};
`;

export default function Progress({ percent }) {
  return (
    <Wrapper>
      <Background>
        <Bar percent={percent} />
      </Background>
    </Wrapper>
  );
}

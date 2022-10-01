import styled from "styled-components";

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2px 12px;
  gap: 4px;

  background: #FFF0F3;
  border-radius: 12px;

  font-weight: 500;
  font-size: 12px;
  line-height: 16px;
  color: #F23252;
`;

export default function CouncilorTag() {
  return (
    <Wrapper>Councilor</Wrapper>
  );
}

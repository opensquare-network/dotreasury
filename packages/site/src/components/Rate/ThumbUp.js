import styled from "styled-components";

const Wrapper = styled.div`
  display: flex;
  font-size: 14px;
  line-height: 22px;
  color: rgba(0, 0, 0, 0.65);
  cursor: pointer;
  > :not(:first-child) {
    margin-left: 8px;
  }
`;

export default function ThumbUp() {
  return (
    <Wrapper>
      <img src="/imgs/thumb-up.svg" alt="" />
      <div>Up</div>
      <div>(0)</div>
    </Wrapper>
  );
}

import styled from "styled-components";

const Bar = styled.div`
  border-radius: 2px;
  background-image: linear-gradient(
    270deg,
    var(--neutral200) 0%,
    var(--neutral300) 100%
  );
`;

export default function SkeletonBar({ width, height, padding }) {
  return <Bar style={{ width, height, padding }} />;
}

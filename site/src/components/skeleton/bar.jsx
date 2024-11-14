import styled from "styled-components";

const Bar = styled.div`
  border-radius: 4px;
  background-image: linear-gradient(
    90deg,
    var(--neutral200) 0%,
    var(--neutral300) 100%
  );
`;

export default function SkeletonBar({ width, height, style }) {
  return <Bar style={{ width, height, ...style }} />;
}

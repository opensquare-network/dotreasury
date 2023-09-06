import styled from "styled-components";
import { ReactComponent as DirectionSVG } from "../Icon/direction.svg";

const Wrapper = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  svg {
    transform: ${(props) => (props.direction === "asc" ? "rotate(180deg)" : "")};
    path {
      fill: var(--textTertiary);
    }
  }
  > span {
    color: var(--pink500);
  }
`;

export default function SortableIndex({ direction, onClick }) {
  return (
    <Wrapper direction={direction} onClick={onClick}>
      <span>Index</span>
      {direction && (
        <div style={{ display: "inline-flex" }}>
          <DirectionSVG />
        </div>
      )}
    </Wrapper>
  );
}

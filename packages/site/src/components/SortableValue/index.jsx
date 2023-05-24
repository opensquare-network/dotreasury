import styled from "styled-components";
import SortByValuePopup, { SortByFields } from "./SortByValuePopup";
import { ReactComponent as DirectionSVG } from "../Icon/direction.svg";

const Wrapper = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: right;
  svg {
    transform: ${(props) => (props.direction === "asc" ? "rotate(180deg)" : "")};
    path {
      fill: var(--textTertiary);
    }
  }
  > span {
    color: var(--textSecondary);
  }
`;

export default function SortableValue({ sortField, setSortField, sortDirection, setSortDirection }) {
  const isSorting = sortField in SortByFields;

  return (
    <SortByValuePopup
      sortField={sortField}
      setSortField={setSortField}
      sortDirection={sortDirection}
      setSortDirection={setSortDirection}
      trigger={
        <Wrapper direction={isSorting ? sortDirection : ""}>
          {isSorting && (
            <div style={{ display: "inline-flex" }}>
              <DirectionSVG />
            </div>
          )}
          <span>Value</span>
        </Wrapper>
      }
    />
  );
}

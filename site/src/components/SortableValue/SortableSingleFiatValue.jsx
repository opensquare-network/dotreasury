import { useStateList } from "react-use";
import { SortableValueWrapper } from ".";
import { ReactComponent as DirectionSVG } from "../Icon/direction.svg";
import { SortByFields } from "./SortByValuePopup";
import { useEffect } from "react";

export default function SortableSingleFiatValue({
  sortField,
  setSortField,
  sortDirection,
  setSortDirection,
}) {
  const isSorting = sortField in SortByFields;
  const { state, next, setState } = useStateList([null, "asc", "desc"]);

  useEffect(() => {
    if (sortDirection) {
      setState(sortDirection);
    }
  }, []);

  useEffect(() => {
    if (!state) {
      setSortField(null);
    } else {
      setSortField("fiat");
      setSortDirection(state);
    }
  }, [state]);

  return (
    <SortableValueWrapper
      role="button"
      direction={isSorting ? sortDirection : ""}
      onClick={() => {
        next();
      }}
    >
      {isSorting && (
        <div style={{ display: "inline-flex" }}>
          <DirectionSVG />
        </div>
      )}
      <span>Value</span>
    </SortableValueWrapper>
  );
}

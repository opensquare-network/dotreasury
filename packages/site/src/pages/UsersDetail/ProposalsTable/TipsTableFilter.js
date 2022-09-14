import { noop } from "lodash";
import { useCallback } from "react";
import { useHistory } from "react-router";
import TipsFilter from "../../Tips/Filter";

export default function TipsTableFilter({
  filterData,
  setFilterData = noop,
  setTablePage = noop,
}) {
  const history = useHistory();
  const filterQuery = useCallback(
    (data) => {
      setFilterData(data);
      setTablePage(1);
      history.push({
        search: data.status ? `status=${data.status}` : null,
      });
    },
    [history]
  );

  return <TipsFilter value={filterData?.status ?? "-1"} query={filterQuery} />;
}

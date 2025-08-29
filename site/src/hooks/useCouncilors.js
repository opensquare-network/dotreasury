import {
  fetchCouncilors,
  loadingSelector,
  councilorsSelector,
} from "../store/reducers/councilorsSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

export default function useCouncilors(page = 0, pageSize = 20) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCouncilors(page, pageSize));
  }, [dispatch, page, pageSize]);

  const loading = useSelector(loadingSelector);
  const councilors = useSelector(councilorsSelector);

  return {
    loading,
    councilors,
  };
}

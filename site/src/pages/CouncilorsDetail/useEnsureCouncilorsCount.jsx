import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import {
  councilorsSelector,
  fetchCouncilorsCount,
} from "../../store/reducers/councilorsSlice";

export default function useEnsureCouncilorsCount() {
  const dispatch = useDispatch();
  const { total } = useSelector(councilorsSelector);

  useEffect(() => {
    if (!total) {
      dispatch(fetchCouncilorsCount());
    }
  }, [dispatch, total]);
}

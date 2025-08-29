import {
  fetchUsers,
  loadingSelector,
  usersSelector,
} from "../store/reducers/usersSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

export default function useCouncilors(page = 0, pageSize = 20) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      fetchUsers(page, pageSize, {
        role: "councilor",
      }),
    );
  }, [dispatch, page, pageSize]);

  const loading = useSelector(loadingSelector);
  const councilors = useSelector(usersSelector);

  return {
    loading,
    councilors,
  };
}

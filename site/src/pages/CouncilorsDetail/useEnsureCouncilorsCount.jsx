import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { usersSelector, fetchUsers } from "../../store/reducers/usersSlice";

export default function useEnsureCouncilorsCount() {
  const dispatch = useDispatch();
  const { total } = useSelector(usersSelector);

  useEffect(() => {
    if (!total) {
      dispatch(fetchUsers(0, 1, { role: "councilor" }));
    }
  }, [dispatch, total]);
}

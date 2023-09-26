import { fetchUsers, usersSelector } from "../../store/reducers/usersSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

/**
 * @description ensure SubHeader `Users(number)` count
 */
export function useEnsureUsersCount() {
  const dispatch = useDispatch();
  const { total } = useSelector(usersSelector);

  useEffect(() => {
    if (!total) {
      dispatch(fetchUsers(0, 1));
    }
  }, [dispatch, total]);
}

import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import {
  beneficiariesSelector,
  fetchBeneficiariesCount,
} from "../../store/reducers/beneficiariesSlice";

export default function useEnsureBenificiariesCount() {
  const dispatch = useDispatch();
  const { total } = useSelector(beneficiariesSelector);

  useEffect(() => {
    if (!total) {
      dispatch(fetchBeneficiariesCount());
    }
  }, [dispatch, total]);
}

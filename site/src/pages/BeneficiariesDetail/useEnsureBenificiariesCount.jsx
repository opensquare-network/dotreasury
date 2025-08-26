import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import {
  beneficiariesSelector,
  fetchBeneficiaries,
} from "../../store/reducers/beneficiariesSlice";

export default function useEnsureBenificiariesCount() {
  const dispatch = useDispatch();
  const { total } = useSelector(beneficiariesSelector);

  useEffect(() => {
    if (!total) {
      dispatch(fetchBeneficiaries(0, 1));
    }
  }, [dispatch, total]);
}

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { resetProposals } from "../../store/reducers/proposalSlice";
import { resetTips } from "../../store/reducers/tipSlice.js";
import {
  resetBounties,
  resetChildBounties,
} from "../../store/reducers/bountySlice";

/**
 * @description reset proposals, tips, bounties and child bounties table data
 */
export function useResetTableData() {
  const dispatch = useDispatch();

  useEffect(() => {
    return () => {
      dispatch(resetProposals());
      dispatch(resetTips());
      dispatch(resetBounties());
      dispatch(resetChildBounties());
    };
  }, [dispatch]);
}

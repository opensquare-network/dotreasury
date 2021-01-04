import React, { useEffect } from "react";
import { Menu, Label } from "semantic-ui-react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProposalsCount,
  proposalsCountSelector,
} from "../../store/reducers/proposalSlice";

function ProposalsMenu() {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(fetchProposalsCount())
  }, [dispatch])

  const proposalsCount = useSelector(proposalsCountSelector);

  return (
    <Menu.Item key="Proposals">
      Proposals<Label>{proposalsCount}</Label>
    </Menu.Item>
    );
}

export default ProposalsMenu;

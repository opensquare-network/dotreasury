import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { Label } from "semantic-ui-react";
import {
  totalBountyCountSelector,
  totalChildBountyCountSelector,
} from "../../store/reducers/overviewSlice";
import { NavItem, NavLabel, NavWrapper } from "../../components/Nav/styled";

function Nav({ active = "" }) {
  const history = useHistory();
  const totalBountyCount = useSelector(totalBountyCountSelector);
  const totalChildBountyCount = useSelector(totalChildBountyCountSelector);

  const items = [
    {
      name: "Bounties",
      label: (
        <NavLabel>
          <span>Bounties</span>
          <Label>{totalBountyCount}</Label>
        </NavLabel>
      ),
      to: "/bounties",
    },
    {
      name: "Child Bounties",
      label: (
        <NavLabel>
          <span>Child Bounties</span>
          <Label>{totalChildBountyCount}</Label>
        </NavLabel>
      ),
      to: "/child-bounties",
    },
  ];

  return (
    <NavWrapper>
      {items.map((item) => (
        <NavItem
          key={item.to}
          active={item.name === active}
          onClick={() => history.push(item.to)}
        >
          {item.label}
        </NavItem>
      ))}
    </NavWrapper>
  );
}

export default Nav;

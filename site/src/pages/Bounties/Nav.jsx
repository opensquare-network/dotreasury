import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { chainSymbolSelector } from "../../store/reducers/chainSlice";
import { Label } from "semantic-ui-react";
import { totalBountyCountSelector, totalChildBountyCountSelector } from "../../store/reducers/overviewSlice";
import { NavItem, NavLabel, NavWrapper } from "../../components/Nav/styled";

function Nav({ active = "" }) {
  const history = useHistory();
  const symbol = useSelector(chainSymbolSelector);
  const name = symbol.toLowerCase();
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
      to: `/${name}/bounties`,
    },
    {
      name: "Child Bounties",
      label: (
        <NavLabel>
          <span>Child Bounties</span>
          <Label>{totalChildBountyCount}</Label>
        </NavLabel>
      ),
      to: `/${name}/child-bounties`,
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

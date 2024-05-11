import { useHistory } from "react-router";
import { Label } from "semantic-ui-react";
import { useSelector } from "react-redux";
import {
  openGovProposalCountSelector,
  totalProposalCountSelector,
  failedProposalCountSelector,
} from "../../store/reducers/overviewSlice";
import { NavItem, NavLabel, NavWrapper } from "../../components/Nav/styled";
import { useQuery } from "../../utils/hooks";
import { currentChainSettings } from "../../utils/chains";
import { ColumnDivider } from "../../components/Divider";
import { useCallback } from "react";

function Nav() {
  const history = useHistory();
  const query = useQuery();
  const tab = query.get("tab");
  const activeTabName =
    tab === "gov1"
      ? "Gov1"
      : tab === "opengov"
      ? "OpenGov"
      : tab === "failed"
      ? "Failed"
      : "All";
  const totalProposalCount = useSelector(totalProposalCountSelector);
  const openGovProposalCount = useSelector(openGovProposalCountSelector);
  const failedProposalCount = useSelector(failedProposalCountSelector);
  const gov1ProposalCount = totalProposalCount - openGovProposalCount;

  const setActiveTab = useCallback(
    (tabName) => {
      const searchParams = new URLSearchParams();

      if (tabName === "Gov1") {
        searchParams.set("tab", "gov1");
      } else if (tabName === "OpenGov") {
        searchParams.set("tab", "opengov");
      } else if (tabName === "Failed") {
        searchParams.set("tab", "failed");
      } else {
        searchParams.delete("tab");
      }

      history.push({ search: searchParams.toString() });
    },
    [history],
  );

  const items = [
    {
      name: "All",
      label: (
        <NavLabel>
          <span>All</span>
          <Label>{totalProposalCount}</Label>
        </NavLabel>
      ),
    },
  ];

  if (currentChainSettings.supportOpenGov) {
    items.push(
      {
        name: "OpenGov",
        label: (
          <NavLabel>
            <span>OpenGov</span>
            <Label>{openGovProposalCount}</Label>
          </NavLabel>
        ),
      },
      {
        name: "Gov1",
        label: (
          <NavLabel>
            <span>Gov1</span>
            <Label>{gov1ProposalCount}</Label>
          </NavLabel>
        ),
      },
    );
  }

  return (
    <NavWrapper>
      {items.map((item, index) => (
        <NavItem
          key={index}
          active={item.name === activeTabName}
          onClick={() => setActiveTab(item.name)}
        >
          {item.label}
        </NavItem>
      ))}
      <ColumnDivider />
      <NavItem
        active={"Failed" === activeTabName}
        onClick={() => setActiveTab("Failed")}
      >
        <NavLabel>
          <span>Failed</span>
          <Label>{failedProposalCount}</Label>
        </NavLabel>
      </NavItem>
    </NavWrapper>
  );
}

export default Nav;

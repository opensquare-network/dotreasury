import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useHistory, useLocation, useParams } from "react-router";
import { TableTitleLabel, TableTitle, TableTitleWrapper } from "./styled";
import { usersCountsSelector } from "../../../store/reducers/usersDetailSlice";
import Tag from "../../../components/Tag/Tag";
import ProposalsTable from "./ProposalsTable";
import TipsTable from "./TipsTable";
import BountiesTable from "./BountiesTable";
import ChildBountiesTable from "./ChildBountiesTable";
import SpendsTable from "./SpendsTable";
import { Link } from "react-router-dom";
import { currentChainSettings } from "../../../utils/chains";
import { useUserTreasurySpendsCount } from "../../../context/userTreasurySpends";

const TABLE_TABS = {
  Proposals: "proposals",
  Tips: "tips",
  Bounties: "bounties",
  ChildBounties: "child-bounties",
  Spends: "spends",
};

export default function ProposalsTables({ role }) {
  const history = useHistory();
  const location = useLocation();
  const { address, tableTab: tableTabParam } = useParams();

  const counts = useSelector(usersCountsSelector);
  const spendsCount = useUserTreasurySpendsCount();

  const tableTitles = useMemo(
    () =>
      [
        currentChainSettings.hasSpends && {
          label: TABLE_TABS.Spends,
          count: spendsCount,
        },
        {
          label: TABLE_TABS.Proposals,
          count: counts?.proposalsCount,
        },
        currentChainSettings.hasTips && {
          label: TABLE_TABS.Tips,
          count: counts?.tipsCount,
        },
        currentChainSettings.hasBounties && {
          label: TABLE_TABS.Bounties,
          count: counts?.bountiesCount,
        },
        currentChainSettings.hasBounties && {
          label: TABLE_TABS.ChildBounties,
          count: counts?.childBountiesCount,
        },
      ].filter(Boolean),
    [counts, spendsCount],
  );
  const [tableTab, setTableTab] = useState(
    tableTabParam || tableTitles[0].label,
  );

  useEffect(() => {
    history.replace({
      search: location.search,
      pathname: `/beneficiaries/${address}/${
        tableTab ? tableTab : tableTitles[0].label
      }`,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setTableTab(tableTabParam);
  }, [role, tableTabParam]);

  const header = (
    <TableTitleWrapper>
      {tableTitles.map((i) => (
        <TableTitle key={i.label} active={tableTab === i.label}>
          <Link to={`${i.label}`}>
            <TableTitleLabel>{i.label.replace("-", " ")}</TableTitleLabel>
            {!!i.count && (
              <Tag key={i.label} rounded color="pink" size="small">
                {i.count}
              </Tag>
            )}
          </Link>
        </TableTitle>
      ))}
    </TableTitleWrapper>
  );

  return <Tables header={header} />;
}

function Tables({ header }) {
  const { tableTab } = useParams();

  const isProposals = useMemo(
    () => tableTab === TABLE_TABS.Proposals,
    [tableTab],
  );
  const isTips = useMemo(() => tableTab === TABLE_TABS.Tips, [tableTab]);
  const isBounties = useMemo(
    () => tableTab === TABLE_TABS.Bounties,
    [tableTab],
  );
  const isChildBounties = useMemo(
    () => tableTab === TABLE_TABS.ChildBounties,
    [tableTab],
  );
  const isSpends = useMemo(() => tableTab === TABLE_TABS.Spends, [tableTab]);

  return (
    <>
      {isProposals && <ProposalsTable header={header} />}

      {isTips && <TipsTable header={header} />}

      {isBounties && <BountiesTable header={header} />}

      {isChildBounties && <ChildBountiesTable header={header} />}

      {isSpends && <SpendsTable header={header} />}
    </>
  );
}

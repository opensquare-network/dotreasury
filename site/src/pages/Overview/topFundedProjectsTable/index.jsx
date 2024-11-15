import { NavLink } from "react-router-dom";
import {
  CardWrapper,
  LinkButton,
  TableWrapper,
  Title,
  TitleContainer,
} from "../BeneficiaryTable";
import IconMask from "../../../components/Icon/Mask";
import { Table as TableOrigin } from "../../../components/Table";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import {
  fetchProjects,
  projectsSelector,
} from "../../../store/reducers/projectSlice";
import NameCellOrigin from "../../Projects/NameCell";
import ProjectProposals from "../../../components/ProjectProposals";
import ValueDisplay from "../../../components/ValueDisplay";
import styled from "styled-components";
import { p_14_medium } from "../../../styles/text";
import { truncate } from "../../../styles/tailwindcss";

const NameCell = styled(NameCellOrigin)`
  ${truncate}
`;

const ProposalsWrapper = styled.div`
  width: 112px;
  display: flex;
  justify-content: flex-end;
`;

const TotalValueCellWrapper = styled.div`
  ${p_14_medium}
  color: var(--textSecondary);
  width: 152px;
`;

const Table = styled(TableOrigin)`
  tbody tr {
    height: 50px;
  }
`;

export default function TopFundedProjectsTable() {
  const dispatch = useDispatch();
  const { items: projects } = useSelector(projectsSelector);

  useEffect(() => {
    dispatch(fetchProjects(0, 10));
  }, [dispatch]);

  const columns = [
    {
      title: "Project",
      cellRender(_, item) {
        return <NameCell name={item.name} logo={item.logo} />;
      },
    },
    {
      title: "Proposals",
      headerCellProps: { textAlign: "right", width: 4 },
      cellProps: { textAlign: "right" },
      cellRender(_, item) {
        return (
          <ProposalsWrapper>
            <ProjectProposals
              dotProposalsCount={item.fundsCount.polkadot}
              ksmProposalsCount={item.fundsCount.kusama}
            />
          </ProposalsWrapper>
        );
      },
    },
    {
      title: "Total value",
      headerCellProps: { textAlign: "right", width: 5 },
      cellProps: { textAlign: "right" },
      cellRender(_, item) {
        return (
          <TotalValueCellWrapper>
            <ValueDisplay
              value={item.fiatValue}
              abbreviate={false}
              prefix="$"
            />
          </TotalValueCellWrapper>
        );
      },
    },
  ];

  return (
    <CardWrapper>
      <TitleContainer>
        <Title>Top Funded Projects</Title>
        <NavLink to={"/projects"}>
          <LinkButton>
            View All
            <IconMask
              src="/imgs/caret-right.svg"
              size={24}
              color="textSecondary"
            />
          </LinkButton>
        </NavLink>
      </TitleContainer>

      <TableWrapper>
        <Table unstackable columns={columns} data={projects} />
      </TableWrapper>
    </CardWrapper>
  );
}

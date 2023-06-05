import styled from "styled-components";
import Tag from "../../components/Tag/Tag";
import ProposalsCount from "../../components/ProposalsCount";
import User from "../../components/User";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { chainSymbolSelector } from "../../store/reducers/chainSlice";

const IDWrapper = styled.div`
  display: inline-block;
`;

const ProposalsWrapper = styled.div`
  display: inline-flex;
`;

const Tags = styled.div`
  display: inline-flex;
  > span {
    background-color: var(--neutral300);
  }
`;

const id = (options) => {
  return {
    key: "id",
    title: "ID",
    width: "320px",
    cellRender(_, data) {
      return (
        <IDWrapper>
          <NavLink to={`/${options?.chainSymbol}/users/${data?.address}`}>
            <User noLink address={data?.address} />
          </NavLink>
        </IDWrapper>
      );
    },
  };
};

const role = {
  key: "role",
  title: "Role",
  cellRender(_, data) {
    return (
      <Tags>
        {data?.isCouncilor && <Tag rounded>Councilor</Tag>}
        {data?.isBeneficiary && <Tag rounded>Benecifiary</Tag>}
        {data?.isProposer && <Tag rounded>Proposer</Tag>}
      </Tags>
    );
  },
};

const proposals = {
  key: "proposals",
  title: "Proposals",
  width: "468px",
  headerCellProps: { textAlign: "right" },
  cellProps: { textAlign: "right" },
  cellRender(_, data) {
    return (
      <ProposalsWrapper>
        <ProposalsCount
          proposals={data?.proposals}
          bounties={data?.bounties}
          childBounties={data?.childBounties}
          tips={data?.tips}
        />
      </ProposalsWrapper>
    );
  },
};

export function useTableColumns() {
  const chainSymbol = useSelector(chainSymbolSelector);
  const options = {
    chainSymbol: chainSymbol?.toLowerCase(),
  };

  return {
    id: id(options),
    role,
    proposals,
  };
}

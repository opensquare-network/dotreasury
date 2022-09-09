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

const id = (options) => {
  return {
    key: "id",
    title: "ID",
    width: "320px",
    cellRender(_, data) {
      return (
        <IDWrapper>
          <NavLink
            to={`/${options?.chainSymbol}/participants/${data?.address}`}
          >
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
      <>
        {/* FIXME: council member, currently not include this field from data */}
        {data?.isCouncilMember && <Tag rounded>Council Member</Tag>}
        {data?.isBeneficiary && <Tag rounded>Benecifiary</Tag>}
        {data?.isProposer && <Tag rounded>Proposer</Tag>}
      </>
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
          bounties={data?.bounties + data?.childBounties}
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

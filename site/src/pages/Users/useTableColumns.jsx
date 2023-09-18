import styled from "styled-components";
import Tag from "../../components/Tag/Tag";
import ProposalsCount from "../../components/ProposalsCount";
import User from "../../components/User";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { chainSymbolSelector } from "../../store/reducers/chainSlice";
import Balance from "../../components/Balance";

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
        {data?.isBeneficiary && <Tag rounded>Beneficiary</Tag>}
        {data?.isProposer && <Tag rounded>Proposer</Tag>}
      </Tags>
    );
  },
};

const commonProposalsFieldProps = {
  key: "proposals",
  title: "Proposals",
  width: "468px",
  headerCellProps: { textAlign: "right" },
  cellProps: { textAlign: "right" },
};

const allProposals = {
  ...commonProposalsFieldProps,
  cellRender(_, data) {
    return (
      <ProposalsWrapper>
        <ProposalsCount
          proposals={data?.proposals?.count}
          bounties={data?.bounties?.count}
          childBounties={data?.childBounties?.count}
          tips={data?.tips?.count}
        />
      </ProposalsWrapper>
    );
  },
};

const proposedProposals = {
  ...commonProposalsFieldProps,
  cellRender(_, data) {
    return (
      <ProposalsWrapper>
        <ProposalsCount
          proposals={data?.proposals?.proposedCount}
          bounties={data?.bounties?.proposedCount}
          childBounties={data?.childBounties?.proposedCount}
          tips={data?.tips?.proposedCount}
        />
      </ProposalsWrapper>
    );
  },
};

const beneficiaryProposals = {
  ...commonProposalsFieldProps,
  cellRender(_, data) {
    return (
      <ProposalsWrapper>
        <ProposalsCount
          proposals={data?.proposals?.benefitCount}
          bounties={data?.bounties?.benefitCount}
          childBounties={data?.childBounties?.benefitCount}
          tips={data?.tips?.benefitCount}
        />
      </ProposalsWrapper>
    );
  },
};

const commonValueFieldProps = {
  key: "value",
  title: "Value",
  width: "468px",
  headerCellProps: { textAlign: "right" },
  cellProps: { textAlign: "right" },
};

const totalValue = {
  ...commonValueFieldProps,
  cellRender(_, data) {
    return (
      <Balance
        value={data?.totalValue?.total}
        usdt={data?.totalFiatValue?.total}
        isUnitPrice={false}
        abbreviate={true}
      />
    );
  },
};

const proposedValue = {
  ...commonValueFieldProps,
  cellRender(_, data) {
    return (
      <Balance
        value={data?.totalValue?.totalProposed}
        usdt={data?.totalFiatValue?.totalProposed}
        isUnitPrice={false}
        abbreviate={true}
      />
    );
  },
};

const benefitValue = {
  ...commonValueFieldProps,
  cellRender(_, data) {
    return (
      <Balance
        value={data?.totalValue?.totalBenefit}
        usdt={data?.totalFiatValue?.totalBenefit}
        isUnitPrice={false}
        abbreviate={true}
      />
    );
  },
};

export function useTableColumns(userRole) {
  const chainSymbol = useSelector(chainSymbolSelector);
  const options = {
    chainSymbol: chainSymbol?.toLowerCase(),
  };

  let proposals = allProposals;
  let value = totalValue;
  if (userRole === "proposer") {
    proposals = proposedProposals;
    value = proposedValue;
  } else if (userRole === "beneficiary") {
    proposals = beneficiaryProposals;
    value = benefitValue;
  }

  return {
    id: id(options),
    role,
    proposals,
    value,
  };
}

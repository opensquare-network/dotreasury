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

export const ProposalsWrapper = styled.div`
  display: inline-flex;
`;

const Tags = styled.div`
  display: inline-flex;
  > span {
    background-color: var(--neutral300);
  }
`;

function getRolesOptions(data = {}) {
  return [
    data.isCouncilor && {
      name: "Councilor",
      link: "/councilor",
    },
    data.isBeneficiary && {
      name: "Beneficiary",
      link: "/beneficiary",
    },
    data.isProposer && {
      name: "Proposer",
      link: "/proposer",
    },
  ].filter(Boolean);
}

const id = (options) => {
  return {
    key: "id",
    title: "ID",
    width: "320px",
    cellRender(_, data) {
      const roles = getRolesOptions(data);

      let link = `/users/${data?.address}`;
      if (roles.length === 1) {
        const role = roles[0];
        link = `${link}${role.link}`;
      }

      return (
        <IDWrapper>
          <NavLink to={link}>
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
    const roles = getRolesOptions(data);

    return (
      <Tags>
        {roles.map((role) => (
          <Tag key={role.name} rounded>
            {role.name}
          </Tag>
        ))}
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

const awardedValue = {
  key: "value",
  title: "Awarded value",
  width: "468px",
  headerCellProps: { textAlign: "right" },
  cellProps: { textAlign: "right" },
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

export function useUsersTableColumns(userRole) {
  const chainSymbol = useSelector(chainSymbolSelector);
  const options = {
    chainSymbol: chainSymbol?.toLowerCase(),
  };

  let proposals = allProposals;
  if (userRole === "proposer") {
    proposals = proposedProposals;
  } else if (userRole === "beneficiary") {
    proposals = beneficiaryProposals;
  }

  return {
    id: id(options),
    role,
    proposals,
    value: awardedValue,
  };
}

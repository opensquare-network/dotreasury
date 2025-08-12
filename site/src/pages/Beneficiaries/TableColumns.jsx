import styled from "styled-components";
import ProposalsCount from "../../components/ProposalsCount";
import User from "../../components/User";
import { NavLink } from "react-router-dom";
import ValueDisplay from "../../components/ValueDisplay";

const IDWrapper = styled.div`
  display: inline-block;
`;

export const ProposalsWrapper = styled.div`
  display: inline-flex;
`;

export const colId = {
  key: "id",
  title: "ID",
  width: "320px",
  cellRender(_, data) {
    return (
      <IDWrapper>
        <NavLink to={`/users/${data?.address}`}>
          <User noLink address={data?.address} />
        </NavLink>
      </IDWrapper>
    );
  },
};

export const colBeneficiaryProposals = {
  key: "proposals",
  title: "Proposals",
  width: "468px",
  headerCellProps: { textAlign: "right" },
  cellProps: { textAlign: "right" },
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

export const colAwardedValue = {
  key: "value",
  title: "Awarded value",
  width: "468px",
  headerCellProps: { textAlign: "right" },
  cellProps: { textAlign: "right" },
  cellRender(_, data) {
    return (
      <ValueDisplay
        value={data.totalBenefitFiatValue}
        prefix="$"
        abbreviate={false}
      />
    );
  },
};

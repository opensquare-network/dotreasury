import styled from "styled-components";
import User from "../../components/User";
import { NavLink } from "react-router-dom";
import Balance from "../../components/Balance";

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
        <NavLink to={`/councilors/${data?.address}`}>
          <User noLink address={data?.address} />
        </NavLink>
      </IDWrapper>
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
      <Balance
        value={data?.totalValue?.totalBenefit}
        usdt={data?.totalFiatValue?.totalBenefit}
        isUnitPrice={false}
        abbreviate={true}
      />
    );
  },
};

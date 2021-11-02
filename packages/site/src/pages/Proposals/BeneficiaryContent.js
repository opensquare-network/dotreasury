import React from "react";
import styled from "styled-components";

import { useIdentity } from "../../utils/hooks";
import Badge from "../../components/User/Badge";

const Wrapper = styled.div`
  font-size: 12px;
  line-height: 18px;
  color: rgba(0, 0, 0, 0.9);
`;

const Title = styled.div`
  font-weight: bold;
`;

const NameWrapper = styled.div`
  display: flex;
  align-items: center; ;
`;

const BeneficiaryContent = ({ proposerAddress, beneficiaryAddress }) => {
  const { name: proposerName, badgeData: proposerBadgeData } =
    useIdentity(proposerAddress);
  const { name: beneficiaryName, badgeData: beneficiaryBadgeData } =
    useIdentity(beneficiaryAddress);

  return (
    <Wrapper>
      <Title>Proposer</Title>
      {proposerName && (
        <NameWrapper>
          <Badge {...proposerBadgeData} />
          <div>{proposerName}</div>
        </NameWrapper>
      )}
      <div>{proposerAddress}</div>
      <Title>Beneficiary</Title>
      {beneficiaryName && (
        <NameWrapper>
          <Badge {...beneficiaryBadgeData} />
          <div>{beneficiaryName}</div>
        </NameWrapper>
      )}
      <div>{beneficiaryAddress}</div>
    </Wrapper>
  );
};

export default BeneficiaryContent;

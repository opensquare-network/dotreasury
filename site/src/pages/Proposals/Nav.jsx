import { Label } from "semantic-ui-react";
import { useSelector } from "react-redux";
import { totalProposalCountSelector } from "../../store/reducers/overviewSlice";
import { NavLabel } from "../../components/Nav/styled";
import styled from "styled-components";
import { h4_16_semibold } from "../../styles/text";

const Header = styled.div`
  padding: 24px;
  ${h4_16_semibold}
`;

const HeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export default function Nav() {
  const totalProposalCount = useSelector(totalProposalCountSelector);

  return (
    <HeaderWrapper>
      <NavLabel>
        <Header>Treasury Proposals</Header>
        <Label>{totalProposalCount}</Label>
      </NavLabel>
    </HeaderWrapper>
  );
}

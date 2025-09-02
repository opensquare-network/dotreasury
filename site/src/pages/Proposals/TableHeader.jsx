import { Label } from "semantic-ui-react";
import { NavLabel } from "../../components/Nav/styled";
import styled from "styled-components";
import { h4_16_semibold } from "../../styles/text";

const Header = styled.div`
  padding: 24px 0 24px 24px;
  ${h4_16_semibold}
`;

const HeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export default function TableHeader({ total }) {
  return (
    <HeaderWrapper>
      <NavLabel>
        <Header>Treasury Proposals</Header>
        <Label>{total}</Label>
      </NavLabel>
    </HeaderWrapper>
  );
}

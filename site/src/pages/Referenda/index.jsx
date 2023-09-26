import styled from "styled-components";
import ReferendaTable from "./ReferendaTable";
import Summary from "./Summary";

const Wrapper = styled.div``;

export default function Referenda() {
  return (
    <Wrapper>
      <Summary />
      <ReferendaTable />
    </Wrapper>
  );
}

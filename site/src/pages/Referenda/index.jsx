import styled from "styled-components";
import ReferendaTable from "./ReferendaTable";
import Summary from "./Summary";
import { useChainRoute } from "../../utils/hooks";

const Wrapper = styled.div`
`;

export default function Referenda() {
  useChainRoute();
  
  return (
    <Wrapper>
      <Summary />
      <ReferendaTable />
    </Wrapper>
  );
}

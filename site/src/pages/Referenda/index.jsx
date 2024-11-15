import styled from "styled-components";
import ReferendaTable from "./ReferendaTable";
import Summary from "./Summary";
import { isPolkadot } from "../../utils/chains";
import PolkadotReferendaTable from "./polkadot";

const Wrapper = styled.div``;

export default function Referenda() {
  return (
    <Wrapper>
      <Summary />
      {isPolkadot ? <PolkadotReferendaTable /> : <ReferendaTable />}
    </Wrapper>
  );
}

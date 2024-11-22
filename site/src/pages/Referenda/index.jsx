import styled from "styled-components";
import ReferendaTable from "./ReferendaTable";
import Summary from "./Summary";
import { isPolkadot } from "../../utils/chains";
import PolkadotReferenda from "./polkadot";

const Wrapper = styled.div``;

export default function Referenda() {
  if (isPolkadot) {
    return <PolkadotReferenda />;
  }

  return (
    <Wrapper>
      <Summary />
      <ReferendaTable />
    </Wrapper>
  );
}

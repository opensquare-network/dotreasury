import styled from "styled-components";
import ReferendaTable from "./ReferendaTable";
import Summary from "./Summary";
import { isKusama, isPolkadot } from "../../utils/chains";
import PolkadotReferenda from "./polkadot";

const Wrapper = styled.div``;

export default function Referenda() {
  if (isPolkadot || isKusama) {
    return <PolkadotReferenda />;
  }

  return (
    <Wrapper>
      <Summary />
      <ReferendaTable />
    </Wrapper>
  );
}

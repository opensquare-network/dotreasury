import styled from "styled-components";
import ReferendaTable from "./ReferendaTable";
import Summary from "./Summary";
// import { isPolkadot } from "../../utils/chains";
// import PolkadotReferenda from "./polkadot";

const Wrapper = styled.div``;

export default function Referenda() {
  // TODO: Uncomment this when Polkadot application page is ready
  // if (isPolkadot) {
  //   return <PolkadotReferenda />;
  // }

  return (
    <Wrapper>
      <Summary />
      <ReferendaTable />
    </Wrapper>
  );
}

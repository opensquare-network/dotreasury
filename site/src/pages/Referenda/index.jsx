import styled from "styled-components";
import ReferendaTable from "./ReferendaTable";
import Summary from "./Summary";
import { isPolkadot } from "../../utils/chains";
import ReferendaPolkadot from "./polkadot";

const Wrapper = styled.div``;

export default function Referenda() {
  if (isPolkadot) {
    return <ReferendaPolkadot />;
  }

  return (
    <Wrapper>
      <Summary />
      <ReferendaTable />
    </Wrapper>
  );
}

import styled from "styled-components";
import ReferendaTable from "./ReferendaTable";
import Summary from "./Summary";
import { isKusama, isPolkadot } from "../../utils/chains";
import Applications from "./applications";

const Wrapper = styled.div``;

export default function Referenda() {
  if (isPolkadot || isKusama) {
    return <Applications />;
  }

  return (
    <Wrapper>
      <Summary />
      <ReferendaTable />
    </Wrapper>
  );
}

import ReferendaTable from "./table";
import Summary from "./summary";
import PolkadotApplicationsProvider from "../../../context/PolkadotApplications";

export default function PolkadotReferenda() {
  return (
    <div>
      <PolkadotApplicationsProvider>
        <Summary />
        <ReferendaTable />
      </PolkadotApplicationsProvider>
    </div>
  );
}

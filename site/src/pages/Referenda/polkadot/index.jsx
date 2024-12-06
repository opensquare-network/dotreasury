import ReferendaTable from "./table";
import Summary from "./summary";
import ApplicationsProvider from "../../../context/Applications";

export default function Applications() {
  return (
    <div>
      <ApplicationsProvider>
        <Summary />
        <ReferendaTable />
      </ApplicationsProvider>
    </div>
  );
}

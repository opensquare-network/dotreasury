import { noop } from "lodash";
import { TableHeaderWrapper } from "./styled";

// TODO
export default function SpendsTable({
  header,
  footer = noop,
  // tablePage,
  // pageSize,
  // filterData,
  // role,
  // address,
}) {
  return (
    <div>
      <TableHeaderWrapper>{header}</TableHeaderWrapper>
      <div>Spends Table</div>
    </div>
  );
}

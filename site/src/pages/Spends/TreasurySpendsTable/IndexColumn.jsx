import { isNil } from "lodash-es";
import TextMinor from "../../../components/TextMinor";

export const treasurySpendsIndexColumn = {
  key: "index",
  title: "Index",
  cellClassName: "index-cell",
  cellRender(_, item) {
    const index = item.index ?? item.proposalIndex;

    if (isNil(index)) {
      return "--";
    }

    return <TextMinor>#{index}</TextMinor>;
  },
};

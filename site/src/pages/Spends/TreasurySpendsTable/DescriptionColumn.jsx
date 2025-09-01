import DescriptionCell from "../../CentrifugeProposals/DescriptionCell";

export const treasurySpendsDescriptionColumn = {
  key: "description",
  title: "Description",
  dataIndex: "description",
  cellClassName: "opengov-description-cell",
  cellRender(_, item) {
    return (
      <DescriptionCell
        description={item.title || "Untitled"}
        tags={{ proposalType: item.type }}
      />
    );
  },
};

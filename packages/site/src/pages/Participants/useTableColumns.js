import Tag from "../../components/Tag/Tag";
import ProposalsCellContent from "./ProposalsCellContent";

const id = {
  key: "id",
  title: "ID",
  width: "320px",
  cellRender() {
    return <div>id</div>;
  },
};

const role = {
  key: "role",
  title: "Role",
  cellRender() {
    return (
      <div>
        <Tag rounded>Role</Tag>
      </div>
    );
  },
};

const proposals = {
  key: "proposals",
  title: "Proposals",
  width: "468px",
  headerCellProps: { textAlign: "right" },
  cellProps: { textAlign: "right" },
  cellRender() {
    // FIXME: pass data
    return <ProposalsCellContent />;
  },
};

export function useTableColumns() {
  return {
    id,
    role,
    proposals,
  };
}

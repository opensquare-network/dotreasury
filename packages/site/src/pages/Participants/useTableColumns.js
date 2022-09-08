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
    return <div>role</div>;
  },
};

const proposals = {
  key: "proposals",
  title: "Proposals",
  width: "468px",
  headerCellProps: { textAlign: "right" },
  cellProps: { textAlign: "right" },
  cellRender() {
    return <div>proposals</div>;
  },
};

export function useTableColumns() {
  return {
    id,
    role,
    proposals,
  };
}

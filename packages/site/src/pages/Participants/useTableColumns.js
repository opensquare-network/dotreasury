import Tag from "../../components/Tag/Tag";
import ProposalsCount from "../../components/ProposalsCount";
import User from "../../components/User";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { chainSelector } from "../../store/reducers/chainSlice";

const id = (options) => {
  return {
    key: "id",
    title: "ID",
    width: "320px",
    cellRender() {
      // FIXME: link to, address
      return (
        <NavLink to={`/${options?.chain}/participants`}>
          <User
            noLink
            address="GLVeryFRbg5hEKvQZcAnLvXZEXhiYaBjzSDwrXBXrfPF7wj"
          />
        </NavLink>
      );
    },
  };
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
    return <ProposalsCount />;
  },
};

export function useTableColumns() {
  const chain = useSelector(chainSelector);

  return {
    id: id({ chain }),
    role,
    proposals,
  };
}

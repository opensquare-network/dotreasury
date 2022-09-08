import styled from "styled-components";
import Tag from "../../components/Tag/Tag";
import ProposalsCount from "../../components/ProposalsCount";
import User from "../../components/User";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { chainSymbolSelector } from "../../store/reducers/chainSlice";

const IDWrapper = styled.div`
  display: inline-block;
`;

const id = (options) => {
  return {
    key: "id",
    title: "ID",
    width: "320px",
    cellRender() {
      // FIXME: link to, address
      return (
        <IDWrapper>
          <NavLink to={`/${options?.chainSymbol}/participants`}>
            <User
              noLink
              address="GLVeryFRbg5hEKvQZcAnLvXZEXhiYaBjzSDwrXBXrfPF7wj"
            />
          </NavLink>
        </IDWrapper>
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
  const chainSymbol = useSelector(chainSymbolSelector);
  const options = {
    chainSymbol: chainSymbol?.toLowerCase(),
  };

  return {
    id: id(options),
    role,
    proposals,
  };
}

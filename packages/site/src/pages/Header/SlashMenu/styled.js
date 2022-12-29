import styled from "styled-components";
import { PRIMARY_THEME_COLOR, SECONDARY_THEME_COLOR } from "../../../constants";

const DropdownMenuItem = styled.div`
  display: flex;
  align-items: center;
  padding: 8px 16px;

  justify-content: space-between;
  height: 36px;

  :hover {
    background: #FAFAFA;
  }
`;

const DropdownMenuLabel = styled.div`
  background: ${SECONDARY_THEME_COLOR};
  height: 20px;
  padding: 0 8px;
  line-height: 20px;
  border-radius: 10px;
  margin-left: 8px;
  color: ${PRIMARY_THEME_COLOR} !important;
  font-weight: 400;
  font-size: .85714286rem;
`;

export {
  DropdownMenuItem,
  DropdownMenuLabel,
};

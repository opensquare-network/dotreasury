import styled from "styled-components";

const DropdownMenuItem = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 8px 16px;

  justify-content: space-between;
  height: 36px;

  :hover {
    background: #fafafa;
  }
`;

const DropdownMenuLabel = styled.div`
  background: var(--secondary);
  height: 20px;
  padding: 0 8px;
  line-height: 20px;
  border-radius: 10px;
  margin-left: 8px;
  color: var(--primary) !important;
  font-weight: 400;
  font-size: 0.85714286rem;
`;

export { DropdownMenuItem, DropdownMenuLabel };

import styled from "styled-components";

export const CellWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 376px;
  gap: 12px;
`;

export const CellAssetBlocks = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const VerticalDivider = styled.div`
  width: 0px;
  border-left: 1px dashed var(--neutral300);
  margin-left: 24px;
  margin-right: 24px;
`;

export const HorizontalDivider = styled.div`
  height: 0px;
  border-top: 1px dashed var(--neutral300);
  margin-top: 24px;
  margin-bottom: 24px;
`;

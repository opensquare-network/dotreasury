import styled from "styled-components";

const Fields = styled.div`
  display: flex;
  gap: 16px;
  flex-grow: 1;
  flex-wrap: wrap;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex-grow: 1;
`;

const FieldTitle = styled.div`
  display: flex;
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  color: var(--textPrimary);
  justify-content: space-between;
`;

export {
  Fields, Field, FieldTitle,
};

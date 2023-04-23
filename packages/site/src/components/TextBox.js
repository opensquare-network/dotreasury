import styled from "styled-components";
import Loading from "./LoadingCircle";

const TextBox = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 8px 16px;
  gap: 16px;

  background: var(--neutral200);
  border-radius: 4px;

  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  color: var(--textPrimary);
`;

const LoadingWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 0;

  background: var(--neutral200);
  border-radius: 4px;
`;

function TextBoxLoading() {
  return (
    <LoadingWrapper>
      <Loading size={20} />
    </LoadingWrapper>
  );
}

export default TextBox;

export { TextBoxLoading };

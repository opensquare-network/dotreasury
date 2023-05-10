import { useRef } from "react";
import styled from "styled-components";
import { emptyFunction } from "../utils";

const Wrapper = styled.div`
  cursor: text;
  display: flex;
  align-items: center;
  padding: 8px 16px;
  background: var(--neutral100);
  border: 1px solid var(--neutral300);
  border-radius: 4px;

  :focus-within,
  :hover {
    border-color: var(--neutral400);
  }
`;

const Input = styled.input`
  flex-grow: 1;
  border: none;
  background: none;
  outline: none;
  height: 22px;
  width: 60px;
  color: var(--textPrimary);

  ::placeholder {
    color: var(--textSecondary);
  }

  &:focus::placeholder {
    color: var(--textTertiary);
  }
`;

const Suffix = styled.div`
  margin-left: 16px;
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  color: var(--textPrimary);
`;

export default function AssetInput({
  symbol,
  placeholder = 0,
  defaultValue,
  onChange = emptyFunction,
}) {
  const inputRef = useRef();
  return (
    <Wrapper onClick={() => inputRef.current?.focus()}>
      <Input
        ref={inputRef}
        placeholder={placeholder}
        defaultValue={defaultValue}
        onChange={onChange}
      />
      <Suffix>{symbol}</Suffix>
    </Wrapper>
  );
}

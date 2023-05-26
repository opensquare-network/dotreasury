import { useRef } from "react";
import styled from "styled-components";
import { emptyFunction } from "../utils";

const Wrapper = styled.div`
  cursor: text;
  display: flex;
  align-items: center;
  padding: 4px 8px;
  gap: 4px;
  background: var(--neutral100);
  border: 1px solid var(--neutral400);
  border-radius: 4px;

  :focus-within,
  :hover {
    border-color: var(--neutral400);
  }
`;

const Input = styled.input`
  flex-grow: 1;
  border: none !important;
  background: none !important;
  outline: none !important;
  width: 51px;
  height: 16px;
  padding: 0 !important;

  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;

  color: var(--textPrimary) !important;

  ::placeholder {
    color: var(--textDisable) !important;
  }

  &:focus::placeholder {
    color: var(--textDisable) !important;
  }

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  -moz-appearance: textfield;
`;

const Suffix = styled.div`
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 16px;
  color: var(--textPrimary);
`;

export default function CompactInput({
  prefix,
  suffix,
  placeholder = 0,
  value,
  onChange = emptyFunction,
}) {
  const inputRef = useRef();
  return (
    <Wrapper onClick={() => inputRef.current?.focus()}>
      {prefix && <Suffix>{prefix}</Suffix>}
      <Input
        ref={inputRef}
        type="number"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
      {suffix && <Suffix>{suffix}</Suffix>}
    </Wrapper>
  );
}

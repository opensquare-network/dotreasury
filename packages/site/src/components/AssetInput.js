import { useRef } from "react";
import styled from "styled-components";
import { emptyFunction } from "../utils";

const Wrapper = styled.div`
  cursor: text;
  display: flex;
  align-items: center;
  padding: 8px 16px;
  background: #FFFFFF;
  border: 1px solid rgba(34,36,38,.15);
  border-radius: 4px;

  :focus-within, :hover {
    border-color: #CCCCCC
  }
`;

const Input = styled.input`
  flex-grow: 1;
  border: none;
  background: none;
  outline: none;
  height: 22px;
  width: 60px;

  ::placeholder {
    color: var(--textDisable);
  }

  &:focus::placeholder {
    color: #cccccc !important;
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

export default function AssetInput({ symbol, placeholder = 0, defaultValue, onChange = emptyFunction }) {
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

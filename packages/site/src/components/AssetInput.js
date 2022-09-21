import { useRef } from "react";
import styled from "styled-components";

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
`;

const Suffix = styled.div`
  margin-left: 16px;
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  color: rgba(0, 0, 0, 0.9);
`;

export default function AssetInput({ symbol }) {
  const inputRef = useRef();
  return (
    <Wrapper onClick={() => inputRef.current?.focus()}>
      <Input ref={inputRef}></Input>
      <Suffix>{symbol}</Suffix>
    </Wrapper>
  )
}

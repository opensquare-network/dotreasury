import styled from "styled-components";

import Text from "../../components/Text";
import TextMinor from "../../components/TextMinor";
import Button from "../../components/Button";
import Input from "../../components/Input";
import FormInput from "../../components/FormInput";
import { WARNING_COLOR } from "../../constants";

export const StyledItem = styled.div`
  :not(:first-child) {
    padding-top: 24px;
  }
  :not(:last-child) {
    padding-bottom: 24px;
    border-bottom: 1px solid #EEEEEE;
  }
`

export const StyledTitle = styled(Text)`
  font-weight: 500px;
  margin-bottom: 8px;
`

export const EditWrapper = styled.div`
  display: flex;
  :not(:last-child) {
    margin-bottom: 8px;
  }
`

export const StyledText = styled(TextMinor)`
  padding: 8px 16px;
  background: #FBFBFB;
  border-radius: 4px;
  flex-grow: 1;
  max-width: calc(100% - 92px);
  overflow: hidden;
  text-overflow: ellipsis;
`

export const EditButton = styled(Button)`
  margin-left: 8px !important;
  width: 84px;
`

export const StyledInput = styled(Input)`
  flex-grow: 1;
  max-width: calc(100% - 92px);
`

export const StyledFormInputWrapper = styled.div`
  flex-grow: 1;
  max-width: calc(100% - 92px);
`

export const StyledFormInput = styled(FormInput)`
  width: 100%;
`

export const StyledButtonPrimary = styled.button`
  width: 100%;
  color: white !important;
  background: ${WARNING_COLOR} !important;
  &.ui.button:hover,
  &.ui.button:active,
  &.ui.button:focus {
    background: ${WARNING_COLOR} !important;
  }
  height: 40px;
  border: 0;
  outline: none;
  border-radius: 4px;
  cursor: pointer;
`;

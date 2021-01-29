import styled from "styled-components";

import Text from "../../components/Text";
import TextMinor from "../../components/TextMinor";
import Button from "../../components/Button";
import Input from "../../components/Input";

export const StyledItem = styled.div`
  padding-top: 24px;
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
  max-width: 268px;
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

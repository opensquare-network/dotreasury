import React from "react";
import styled from "styled-components";

import { PRIMARY_THEME_COLOR } from "../../constants";
import Text from "../../components/Text";

const Wrapper = styled.div`
  padding: 8px 16px;
  background: #fbfbfb;
  border-radius: 4px;
  display: flex;
  align-items: center;
  .grow {
    flex-grow: 1;
  }
  :not(:last-child) {
    margin-bottom: 8px;
  }
`

const CheckItem = styled.div`
  width: 16px;
  height: 16px;
  border: 1px solid rgba(29, 37, 60, 0.64);
  border-radius: 8px;
  margin-right: 8px;
`

const CheckedItem = styled.div`
  width: 16px;
  height: 16px;
  border: 5px solid ${PRIMARY_THEME_COLOR};
  border-radius: 8px;
  margin-right: 8px;
`

const Detail = styled(Text)`
  color: #3ABC3F;
`

const SettingItem = () => {
  return (
    <Wrapper>
      <CheckItem />
      {false && <CheckedItem />}
      <Text className="grow">Hosted by Parity</Text>
      <Detail>50 ms</Detail>
    </Wrapper>
  )
}

export default SettingItem;

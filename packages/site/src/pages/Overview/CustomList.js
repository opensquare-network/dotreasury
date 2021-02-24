import React from "react";
import styled from "styled-components";

import Text from "../../components/Text";
import Label from "./CustomLabel";

const Wrapper = styled.div`
  & > :not(:last-child) {
    margin-bottom: 8px;
  }
`

const Title = styled(Text)`
  font-weight: 500;
  line-height: 24px;
`

const List = ({ data }) => {
  const { title, icon, labels } = data;
  return (
    <Wrapper>
      {title && <Title>
        {title}
      </Title>}
      {
        (labels || []).map((item, index) => <Label key={index} data={item} icon={icon} />)
      }
    </Wrapper>
  )
}

export default List;

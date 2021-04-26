import React from "react";
import styled from "styled-components";

import Text from "../../components/Text";
import Label from "./CustomLabel";
import { TEXT_DARK_DISABLE } from "../../constants";

const Wrapper = styled.div`
  min-width: 240px;
  & > :not(:last-child) {
    margin-bottom: 8px;
  }
`;

const Title = styled(Text)`
  font-weight: 500;
  line-height: 24px;
`;

const Date = styled(Text)`
  color: ${TEXT_DARK_DISABLE};
  margin-left: auto;
`;

const TitleWrapper = styled.div`
  display: flex;
`;

const List = ({ data, status, clickEvent }) => {
  const { title, date, icon, labels } = data;
  return (
    <Wrapper>
      {(title || date) && (
        <TitleWrapper>
          <Title>{title}</Title>
          <Date>{date}</Date>
        </TitleWrapper>
      )}
      {(labels || []).map((item, index) => (
        <Label
          key={index}
          data={item}
          status={status?.labels[index]}
          icon={icon}
          clickEvent={clickEvent}
        />
      ))}
    </Wrapper>
  );
};

export default List;

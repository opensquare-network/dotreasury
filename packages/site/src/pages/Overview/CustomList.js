import React from "react";
import styled from "styled-components";

import Text from "../../components/Text";
import Label from "./CustomLabel";
import { TEXT_DARK_DISABLE } from "../../constants";
import { p_12_normal, p_14_medium } from "../../styles/text";
import { items_center } from "../../styles/tailwindcss";

const Wrapper = styled.div`
  min-width: 240px;
  & > :not(:last-child) {
    margin-bottom: 8px;
  }
`;

const Title = styled(Text)`
  ${p_14_medium};
`;

const Date = styled(Text)`
  color: ${TEXT_DARK_DISABLE};
  margin-left: auto;
  ${p_12_normal};
`;

const TitleWrapper = styled.div`
  display: flex;
  ${items_center};
`;

const List = ({ data, status, clickEvent, className }) => {
  const { title, date, icon, labels } = data;
  return (
    <Wrapper className={className}>
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

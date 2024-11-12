import styled from "styled-components";
import Tooltip from "../../../../components/Tooltip";
import { h3_18_semibold, p_12_medium } from "../../../../styles/text";
import { text_primary, text_secondary } from "../../../../styles/tailwindcss";

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  padding-left: 12px;
  padding-right: 12px;
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
`;

const Icon = styled.div``;

const Title = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  ${p_12_medium}
  ${text_secondary}
`;

const Value = styled.div`
  ${h3_18_semibold}
  ${text_primary}
`;

export default function CellHeader({ label, description, value, icon }) {
  return (
    <Wrapper>
      <Info>
        <Title>
          {label}
          <Tooltip tooltipContent={description} />
        </Title>
        <Value>{value}</Value>
      </Info>
      <Icon>{icon}</Icon>
    </Wrapper>
  );
}

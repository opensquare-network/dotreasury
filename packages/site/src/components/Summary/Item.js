import styled from "styled-components";
import {
  flex,
  gap_x,
  hidden,
  items_center,
  m,
  w,
} from "../../styles/tailwindcss";
import { p_12_normal } from "../../styles/text";
import { smcss } from "../../styles/responsive";

const Wrapper = styled.div`
  ${flex};
  ${items_center};
  ${gap_x(12)};
  ${w(210)};
`;

const Title = styled.h4`
  ${m(0)};
  color: var(--textSecondary);
  ${p_12_normal};
`;
const InfoWrapper = styled.div`
  min-width: 138px;
`;
const IconWrapper = styled.div`
  ${smcss(hidden)};
`;

export default function SummaryItem({ title = "", icon, content }) {
  return (
    <Wrapper>
      <InfoWrapper>
        <Title>{title}</Title>
        {content}
      </InfoWrapper>

      {icon && <IconWrapper>{icon}</IconWrapper>}
    </Wrapper>
  );
}

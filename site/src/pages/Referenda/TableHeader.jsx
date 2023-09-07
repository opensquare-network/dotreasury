import React from "react";
import styled, { css } from "styled-components";
import Text from "../../components/Text";
import { useSelector } from "react-redux";
import { applicationSummarySelector } from "../../store/reducers/openGovApplicationsSlice";
import { Flex } from "../../components/styled";
import { p_12_normal, p_14_medium } from "../../styles/text";
import { smcss } from "../../styles/responsive";

const HeaderWrapper = styled.div`
  padding: 24px;
  display: flex;
  justify-content: space-between;

  ${smcss(css`
    flex-direction: column;
  `)}
`;

const Title = styled(Text)`
  font-size: 16px;
  line-height: 24px;
  font-weight: 700;

  ${smcss(css`
    margin-bottom: 16px;
  `)}
`;

const BriefLabel = styled.span`
  color: var(--textTertiary);
  ${p_12_normal};
`;
const BriefValue = styled.span`
  color: var(--textPrimary);
  ${p_14_medium};
`;

export default function TableHeader() {
  const applicationSummary = useSelector(applicationSummarySelector);
  const all = applicationSummary?.all;

  const briefs = [
    {
      label: "Voting",
      value: all?.voting ?? 0,
    },
    {
      label: "Passing",
      value: all?.passing ?? 0,
    },
    {
      label: "Approved",
      value: all?.approved ?? 0,
    },
    {
      label: "Rejected",
      value: all?.rejected ?? 0,
    },
  ];

  return (
    <HeaderWrapper>
      <Title>OpenGov Applications</Title>

      <Flex style={{ gap: 16, flexWrap: "wrap" }}>
        {briefs.map((brief) => (
          <Flex key={brief.label} style={{ gap: 8 }}>
            <BriefLabel>{brief.label}</BriefLabel>
            <BriefValue>{brief.value}</BriefValue>
          </Flex>
        ))}
      </Flex>
    </HeaderWrapper>
  );
}

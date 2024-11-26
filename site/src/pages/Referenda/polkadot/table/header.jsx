import React from "react";
import styled, { css } from "styled-components";
import Text from "../../../../components/Text";
import { Flex } from "../../../../components/styled";
import { p_12_normal, p_12_medium } from "../../../../styles/text";
import { smcss } from "../../../../styles/responsive";
import useReferendumsProcess from "../../../../hooks/applications/polkadot/useReferendumsProcess";
import IconMask from "../../../../components/Icon/Mask";
import ExternalLink from "../../../../components/ExternalLink";
import TextMinor from "../../../../components/TextMinor";

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
  ${p_12_medium};
`;

const LinkButton = styled(TextMinor)`
  ${p_12_medium};
  display: flex;
  align-items: center;
  :hover {
    color: var(--textPrimary);
    & > :last-child {
      -webkit-filter: grayscale(0);
      filter: grayscale(0);
      opacity: 1;
    }
  }
`;

const Divider = styled.div`
  position: relative;
  width: 1px;
  height: 16px;
  background: var(--neutral300);
`;

export default function TableHeader() {
  const { voting, passing, isLoading } = useReferendumsProcess();
  if (isLoading) {
    return null;
  }

  const briefs = [
    {
      label: "Voting",
      value: voting,
    },
    {
      label: "Passing",
      value: passing,
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
        <Divider />
        <ExternalLink href={`https://polkadot.subsquare.io/referenda`}>
          <LinkButton>
            View All
            <IconMask
              src="/imgs/caret-right.svg"
              size={16}
              color="textSecondary"
            />
          </LinkButton>
        </ExternalLink>
      </Flex>
    </HeaderWrapper>
  );
}

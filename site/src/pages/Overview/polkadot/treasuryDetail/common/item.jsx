import styled from "styled-components";
import SummaryItemOrigin from "../../../../../components/Summary/Item";
import { space_y } from "../../../../../styles/tailwindcss";
import ImageWithDark from "../../../../../components/ImageWithDark";
import { h3_18_semibold } from "../../../../../styles/text";
import Tooltip from "../../../../../components/Tooltip";

const Wrapper = styled.div`
  ${space_y(12)}
  color: var(--textPrimary);
`;

const ContentWrapper = styled.div`
  ${h3_18_semibold}
`;

const SummaryItem = styled(SummaryItemOrigin)`
  padding: 0 12px;
  > div:first-child {
    width: 100%;
  }
`;

const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

export default function TreasuryDetailItem({
  title = "",
  titleTooltipContent = "",
  iconSrc,
  content,
  footer,
}) {
  return (
    <Wrapper>
      <SummaryItem
        title={
          <TitleWrapper>
            {title}
            <Tooltip tooltipContent={titleTooltipContent}>
              <ImageWithDark src="/imgs/info.svg" />
            </Tooltip>
          </TitleWrapper>
        }
        icon={iconSrc && <ImageWithDark src={iconSrc} />}
        content={content && <ContentWrapper>{content}</ContentWrapper>}
        footer={footer}
      />

      {footer}
    </Wrapper>
  );
}

import styled from "styled-components";
import SummaryItem from "../../../../../components/Summary/Item";
import { space_y } from "../../../../../styles/tailwindcss";
import ImageWithDark from "../../../../../components/ImageWithDark";
import { h3_18_semibold, p_12_medium } from "../../../../../styles/text";
import Tooltip from "../../../../../components/Tooltip";
import SkeletonBar from "../../../../../components/skeleton/bar";

const Wrapper = styled.div`
  ${space_y(12)}
  color: var(--textPrimary);
`;

const ContentWrapper = styled.div`
  ${h3_18_semibold}
`;

const TitleWrapper = styled.div`
  ${p_12_medium}
  display: flex;
  align-items: center;
  gap: 4px;
`;

export default function TreasuryDetailItem({
  title = "",
  titleTooltipContent = "",
  iconSrc,
  content: contentProp,
  footer,
  isLoading,
}) {
  let content;
  if (isLoading) {
    content = (
      <SkeletonBar width={160} height={22} style={{ margin: "3px 0" }} />
    );
  } else if (contentProp) {
    content = <ContentWrapper>{contentProp}</ContentWrapper>;
  }

  return (
    <Wrapper>
      <SummaryItem
        title={
          <TitleWrapper>
            {title}
            {titleTooltipContent && (
              <Tooltip tooltipContent={titleTooltipContent}>
                <ImageWithDark src="/imgs/info.svg" />
              </Tooltip>
            )}
          </TitleWrapper>
        }
        icon={iconSrc && <ImageWithDark src={iconSrc} width={60} height={60} />}
        content={content}
        footer={footer}
      />

      {footer}
    </Wrapper>
  );
}

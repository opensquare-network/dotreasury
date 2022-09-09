// used in pages
// - project detail
// - users detail

import {
  InfoCardWrapper,
  InfoCardDetailWrapper,
  InfoCardIcon,
  InfoCardDetail,
  InfoCardTitle,
  InfoCardDescription,
  InfoCardLinksWrapper,
  InfoCardExtraWrapper,
  InfoCardExtraItemWrapper,
  InfoCardExtraItemLabel,
  InfoCardDivider,
} from "./styled";
import Links from "./Links";

function InfoCard({ icon, title, description, links, extra }) {
  return (
    <InfoCardWrapper>
      <InfoCardDetailWrapper>
        <InfoCardIcon src={icon} />

        <InfoCardDetail>
          <div>
            <InfoCardTitle>{title}</InfoCardTitle>
            <InfoCardDescription>{description}</InfoCardDescription>
          </div>

          <InfoCardLinksWrapper>
            <Links links={links} />
          </InfoCardLinksWrapper>
        </InfoCardDetail>
      </InfoCardDetailWrapper>

      <InfoCardDivider />

      <InfoCardExtraWrapper>{extra}</InfoCardExtraWrapper>
    </InfoCardWrapper>
  );
}

function InfoCardExtraItem({ label, children }) {
  return (
    <InfoCardExtraItemWrapper>
      <InfoCardExtraItemLabel>{label}</InfoCardExtraItemLabel>
      {children}
    </InfoCardExtraItemWrapper>
  );
}

export { InfoCard as default, InfoCardExtraItem };

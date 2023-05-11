import React from "react";
import styled from "styled-components";
import { Popup } from "semantic-ui-react";

import ExternalLink from "./ExternalLink";
import getLinkNameAndSrc from "../utils/link";
import { useDisablePopup } from "../utils/hooks";
import ImageWithDark from "./ImageWithDark";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  > :not(:last-child) {
    margin-right: 8px;
  }
  > * {
    margin-top: 2px;
    margin-bottom: 2px;
  }
`;

const CustomImage = styled(ImageWithDark)`
  width: 20px;
`;

const RelatedLinks = ({ links }) => {
  const disabledPopup = useDisablePopup();
  return (
    <Wrapper>
      {(links || []).map((item, index) => {
        const [, src] = getLinkNameAndSrc(item.link);
        return (
          <Popup
            content={item.description}
            size="mini"
            disabled={disabledPopup || !item.description}
            trigger={
              <div>
                <ExternalLink href={item.link}>
                  <CustomImage src={src} />
                </ExternalLink>
              </div>
            }
            key={index}
          />
        );
      })}
    </Wrapper>
  );
};

export default RelatedLinks;

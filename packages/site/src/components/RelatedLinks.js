import React from "react";
import styled from "styled-components";
import { Image, Popup } from "semantic-ui-react";

import ExternalLink from "./ExternalLink";
import { getLinkNameAndSrc } from "../utils";
import { useDisablePopup } from "../utils/hooks";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  > :not(:last-child) {
    margin-right: 8px;
  }
  > * {
    margin-top: 2px;
    margin-bottom: 2px;
  }
`;

const CustomImage = styled(Image)`
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

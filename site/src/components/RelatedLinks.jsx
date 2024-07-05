import React from "react";
import styled from "styled-components";

import ExternalLink from "./ExternalLink";
import getLinkNameAndSrc from "../utils/link";
import ImageWithDark from "./ImageWithDark";
import Tooltip from "./Tooltip";

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
  return (
    <Wrapper>
      {(links || []).map((item, index) => {
        const [, src] = getLinkNameAndSrc(item.link);
        return (
          <Tooltip key={index} tooltipContent={item.description}>
            <div>
              <ExternalLink href={item.link}>
                <CustomImage src={src} />
              </ExternalLink>
            </div>
          </Tooltip>
        );
      })}
    </Wrapper>
  );
};

export default RelatedLinks;

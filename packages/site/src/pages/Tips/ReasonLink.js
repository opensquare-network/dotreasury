import React from "react";

import ClickableLink from "../../components/ClickableLink";
import {useLinks} from "../../utils/hooks";

const ReasonLink = ({text}) => {
  const links = useLinks(text);

  return (
    <>
      <ClickableLink links={links}>
        {text}
      </ClickableLink>
    </>
  )
}

export default ReasonLink

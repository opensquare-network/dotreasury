import React from "react";

import ClickableLink from "../ClickableLink";
import { useLinks } from "../../utils/hooks";

const TextLinks = ({ text }) => {
  const links = useLinks(text);

  return (
    <>
      <ClickableLink links={links}>
        {text}
      </ClickableLink>
    </>
  );
};

export default TextLinks;

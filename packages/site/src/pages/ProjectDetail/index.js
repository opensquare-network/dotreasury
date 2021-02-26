import React from "react";

import DetailGoBack from "../components/DetailGoBack";
import RelatedLinks from "../RelatedLinks";
import Comment from "../Comment";
import Detail from "./Detail";

const ProjectDetail = () => {
  return (
    <>
      <DetailGoBack />
      <Detail />
      <RelatedLinks />
      <Comment />
    </>
  )
}

export default ProjectDetail;

import React from "react";

import DetailGoBack from "../components/DetailGoBack";
import RelatedLinks from "../RelatedLinks";
import Comment from "../Comment";
import Detail from "./Detail";
import Proposals from "./Proposals";

const ProjectDetail = () => {
  return (
    <>
      <DetailGoBack />
      <Detail />
      <RelatedLinks />
      <Proposals />
      <Comment />
    </>
  )
}

export default ProjectDetail;

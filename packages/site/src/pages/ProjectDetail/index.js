import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";

import DetailGoBack from "../components/DetailGoBack";
// import Comment from "../Comment";
import RelatedLinks from "./RelatedLinks";
import Detail from "./Detail";
import Proposals from "./Proposals";
import { useComponentWillMount } from "../../utils/hooks";
import {
  setProjectDetail,
  fetchProjectDetail,
  // loadingProjectDetailSelector,
  projectDetailSelector,
} from "../../store/reducers/projectSlice";

const ProjectDetail = () => {
  const { projectName } = useParams();

  const dispatch = useDispatch();

  useComponentWillMount(() => {
    dispatch(setProjectDetail({}));
  });

  useEffect(() => {
    dispatch(fetchProjectDetail(projectName));
  }, [dispatch, projectName]);

  // const loadingProjectDetail = useSelector(loadingProjectDetailSelector);
  const projectDetail = useSelector(projectDetailSelector);

  const detailData = {
    name: projectDetail.name,
    logo: projectDetail.logo,
    description: projectDetail.description,
    proposals: projectDetail.proposals?.length,
    expense: projectDetail.proposals?.reduce((previous, current) => (
      previous + current.amount ?? 0
    ), 0),
    dollar: projectDetail.proposals?.reduce((previous, current) => (
      previous + current.amount ?? 0 * current.proposeTimePrice ?? 0
    ), 0)
  }

  return (
    <>
      <DetailGoBack />
      <Detail data={detailData} />
      <RelatedLinks data={projectDetail.relatedLinks} />
      <Proposals data={projectDetail.proposals} />
      {/* <Comment /> */}
    </>
  )
}

export default ProjectDetail;

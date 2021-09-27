import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";

import DetailGoBack from "../components/DetailGoBack";
import Comment from "../Comment";
import RelatedLinks from "./RelatedLinks";
import Detail from "./Detail";
import Proposals from "./Proposals";
import {
  setProjectDetail,
  fetchProjectDetail,
  projectDetailSelector,
} from "../../store/reducers/projectSlice";
import { chainSelector } from "../../store/reducers/chainSlice";
import { useChainRoute } from "../../utils/hooks";
import Rate from "../../components/Rate";
import styled from "styled-components";

const CommentWrapper = styled.div`
> :not(:first-child) {
  margin-top: 24px;
}
`;

const ProjectDetail = () => {
  useChainRoute();

  const { projectId } = useParams();

  const dispatch = useDispatch();
  const chain = useSelector(chainSelector);

  useEffect(() => {
    dispatch(fetchProjectDetail(chain, projectId));
    return () => {
      dispatch(setProjectDetail({}));
    };
  }, [dispatch, chain, projectId]);

  const projectDetail = useSelector(projectDetailSelector);

  const detailData = {
    name: projectDetail.name,
    logo: projectDetail.logo,
    description: projectDetail.description,
    proposals: projectDetail.proposals?.length,
    expense: projectDetail.proposals?.reduce(
      (previous, current) => previous + (current.amount ?? 0),
      0
    ),
    dollar: projectDetail.proposals
      ?.reduce(
        (previous, current) =>
          previous + (current.amount ?? 0) * (current.proposeTimePrice ?? 0),
        0
      )
      .toFixed(2)
      .replace(/\D00/, ""),
  };

  return (
    <>
      <DetailGoBack />
      <Detail data={detailData} projectData={projectDetail} />
      <RelatedLinks data={projectDetail.relatedLinks} />
      <Proposals data={projectDetail.proposals} />
      <CommentWrapper>
        <Rate type="project" index={projectId} />
        <Comment type="project" index={projectId} />
      </CommentWrapper>
    </>
  );
};

export default ProjectDetail;

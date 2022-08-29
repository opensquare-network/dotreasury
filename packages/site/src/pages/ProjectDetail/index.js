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

  return (
    <>
      <DetailGoBack />
      <Detail projectData={projectDetail} />
      <RelatedLinks data={projectDetail.relatedLinks} />
      <Proposals data={projectDetail.funds} />
      <CommentWrapper>
        <Rate type="project" index={projectId} />
        <Comment type="project" index={projectId} />
      </CommentWrapper>
    </>
  );
};

export default ProjectDetail;

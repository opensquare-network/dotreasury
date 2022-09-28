import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";

import Comment from "../Comment";
import Detail from "./Detail";
import Proposals from "./Proposals";
import {
  fetchProjectDetail,
  fetchProjects,
  projectDetailSelector,
  setProjectDetail,
  loadingSelector,
} from "../../store/reducers/projectSlice";
import { chainSelector } from "../../store/reducers/chainSlice";
import { useChainRoute } from "../../utils/hooks";
import Rate from "../../components/Rate";
import styled from "styled-components";
import TableLoading from "../../components/TableLoading";
import DetailGoBack from "../../pages/components/DetailGoBack";

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
  const loading = useSelector(loadingSelector);

  useEffect(() => {
    dispatch(fetchProjectDetail(chain, projectId));
    return () => {
      dispatch(setProjectDetail({}));
    };
  }, [dispatch, chain, projectId]);

  useEffect(() => {
    dispatch(fetchProjects(chain, 0, 10));
  }, [dispatch, chain]);

  const projectDetail = useSelector(projectDetailSelector);

  return (
    <>
      <DetailGoBack />

      <TableLoading loading={loading}>
        <Detail projectData={projectDetail} />
      </TableLoading>

      <TableLoading loading={loading}>
        <Proposals data={projectDetail.funds} />
      </TableLoading>

      <CommentWrapper>
        <Rate type="projects" index={projectId} />
        <Comment type="projects" index={projectId} />
      </CommentWrapper>
    </>
  );
};

export default ProjectDetail;

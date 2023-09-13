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
  const { projectId } = useParams();

  const dispatch = useDispatch();
  const loading = useSelector(loadingSelector);

  useEffect(() => {
    dispatch(fetchProjectDetail(projectId));
    return () => {
      dispatch(setProjectDetail({}));
    };
  }, [dispatch, projectId]);

  useEffect(() => {
    dispatch(fetchProjects(0, 10));
  }, [dispatch]);

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
        <Rate type="project" index={projectId} />
        <Comment type="project" index={projectId} />
      </CommentWrapper>
    </>
  );
};

export default ProjectDetail;

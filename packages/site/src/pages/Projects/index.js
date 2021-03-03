import React, { useEffect } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";

import Title from "../../components/Title";
import ProjectsTable from "./ProjectsTable";

import {
  fetchProjects,
  projectsSelector,
  loadingSelector
} from "../../store/reducers/projectSlice";

const Header = styled(Title)`
  margin-bottom: 20px;
`;

const Projects = () => {

  const dispatch = useDispatch();
  const { items: projects } = useSelector(projectsSelector);
  const loading = useSelector(loadingSelector);

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  return (
    <>
      <Header>Projects</Header>
      <ProjectsTable data={projects} loading={loading} />
    </>
  )
}

export default Projects;

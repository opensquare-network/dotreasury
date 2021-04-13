import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";

import Title from "../../components/Title";
import ResponsivePagination from "../../components/ResponsivePagination";
import { useQuery } from "../../utils/hooks";
import ProjectsTable from "./ProjectsTable";

import {
  fetchProjects,
  projectsSelector,
  loadingSelector
} from "../../store/reducers/projectSlice";
import { chainSelector } from "../../store/reducers/chainSlice";

const Header = styled(Title)`
  margin-bottom: 20px;
`;

const DEFAULT_PAGE_SIZE = 20;
const DEFAULT_QUERY_PAGE = 1;

const Projects = () => {
  const searchPage = parseInt(useQuery().get("page"));
  const queryPage =
    searchPage && !isNaN(searchPage) && searchPage > 0
      ? searchPage
      : DEFAULT_QUERY_PAGE;
  const [tablePage, setTablePage] = useState(queryPage);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  const dispatch = useDispatch();
  const history = useHistory();
  const { items: projects, total } = useSelector(projectsSelector);
  const loading = useSelector(loadingSelector);
  const chain = useSelector(chainSelector);

  const totalPages = Math.ceil(total / pageSize);


  useEffect(() => {
    dispatch(fetchProjects(chain, tablePage - 1, pageSize));
  }, [dispatch, chain, tablePage, pageSize]);

  return (
    <>
      <Header>Projects</Header>
      <ProjectsTable data={projects} loading={loading} />
      <ResponsivePagination
        activePage={tablePage}
        totalPages={totalPages}
        pageSize={pageSize}
        setPageSize={(pageSize) => {
          setTablePage(DEFAULT_QUERY_PAGE);
          setPageSize(pageSize);
          history.push({
            search: null,
          });
        }}
        onPageChange={(_, { activePage }) => {
          history.push({
            search:
              activePage === DEFAULT_QUERY_PAGE ? null : `?page=${activePage}`,
          });
          setTablePage(activePage);
        }}
      />
    </>
  )
}

export default Projects;

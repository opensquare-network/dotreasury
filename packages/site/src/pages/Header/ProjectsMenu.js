import React, { useEffect } from "react";
import { Label, Menu } from "semantic-ui-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProjects, projectsSelector } from "../../store/reducers/projectSlice";
import { chainSelector } from "../../store/reducers/chainSlice";

function ProjectsMenu() {
  const projects = useSelector(projectsSelector);
  const dispatch = useDispatch();
  const chain = useSelector(chainSelector);

  useEffect(()=>{
    if(projects?.items?.length === 0){
      dispatch(fetchProjects(chain,  0, 1));
    }
  }, [chain, dispatch, projects])

  return (
    <Menu.Item key="Projects">
      Projects<Label>{projects?.total ?? 0}</Label>
    </Menu.Item>
  );
}

export default ProjectsMenu;

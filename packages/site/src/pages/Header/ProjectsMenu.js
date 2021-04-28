import React from "react";
import { Label, Menu } from "semantic-ui-react";
import { useSelector } from "react-redux";
import { projectsSelector } from "../../store/reducers/projectSlice";

function ProjectsMenu() {
  const projects = useSelector(projectsSelector);

  return (
    <Menu.Item key="Projects">
      Projects<Label>{projects?.total ?? 0}</Label>
    </Menu.Item>
  );
}

export default ProjectsMenu;

import React from "react";
import styled from "styled-components";

import Title from "../../components/Title";
import ProjectsTable from "./ProjectsTable";

const Header = styled(Title)`
  margin-bottom: 20px;
`;

const data = [
  {
    name: "OpenSquare",
    icon: "",
    description: "A Kusama/Polkadot treasury explorer",
    proposals: 2,
    expense: 1000,
    start: 1614312040000,
    end: 1614312040000,
  },
  {
    name: "ChainX",
    icon: "",
    description: "Volutpat sed semper fermentum rhoncus ut morbi adipiscing",
    proposals: 3,
    expense: 1000,
    start: 1614312040000,
  },
  {
    name: "Litentry",
    icon: "",
    description: "Fermentum ipsum cursus vestibulum, adipiscing magna",
    proposals: 1,
    expense: 1000,
    end: 1614312040000,
  },
  {
    name: "Default Avatar",
    icon: "",
    description: "XXX",
    proposals: 0,
    expense: 0,
  }
]

const Projects = () => {
  return (
    <>
      <Header>Projects</Header>
      <ProjectsTable data={data} />
    </>
  )
}

export default Projects;

import React from "react";
import styled from "styled-components";
import Title from "../../components/Title";

const Header = styled(Title)`
  margin-bottom: 20px;
`;

const Overview = () => {
  return (
    <>
      <Header>Treasury Overview</Header>
    </>
  );
};

export default Overview;

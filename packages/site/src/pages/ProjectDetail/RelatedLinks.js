import React from "react";
import styled from "styled-components";

import LinkItem from "../../components/LinkItem";
import Table from "../../components/Table";
import Card from "../../components/Card";

const Wrapper = styled(Card)`
  padding: 0;
  margin-bottom: 24px;
  table {
    border: none !important;
  }
  a > p {
    white-space: nowrap;
  }
`;

const RelatedLinks = ({ data }) => {
  if (data && data.length > 0) {
    return (
      <Wrapper>
        <Table unstackable>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Related Links</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {data.map((link, index) => (
              <LinkItem key={index} text={link.description} link={link.link} />
            ))}
          </Table.Body>
        </Table>
      </Wrapper>
    );
  } else {
    return null;
  }
};

export default RelatedLinks;

import React from "react";
import styled from "styled-components";
import Pagination from "./Pagination";


const Container = styled.div`
  @media screen and (max-width: 640px) {
    div:first-child {
      display: none;
    }
  }

  @media screen and (min-width: 640px) {
    div:nth-child(2) {
      display: none;
    }
  }
`

const ResponsivePagination = ({ activePage, totalPages, onPageChange }) => {
  return (
    <Container>
      <Pagination
        activePage={activePage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
      <Pagination
        activePage={activePage}
        totalPages={totalPages}
        firstItem={null}
        lastItem={null}
        siblingRange={0}
        onPageChange={onPageChange}
      />
    </Container>
  )
}

export default ResponsivePagination;

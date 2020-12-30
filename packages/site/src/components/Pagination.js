import React from "react";
import { Icon, Pagination } from "semantic-ui-react";
import styled from "styled-components";

import {PRIMARY_THEME_COLOR} from "../constants"
import {SECONDARY_THEME_COLOR} from "../constants"

const Wrapper = styled.div`
  margin: 10px 0;
  display: flex;
  justify-content: flex-end;

  a {
    font-family: Inter !important;
    outline: none !important;
    &.active {
      color: ${PRIMARY_THEME_COLOR} !important;
      background: ${SECONDARY_THEME_COLOR} !important;
    }
  }
`;

const CustomPagination = (props) => {
  const totalPages = props.totalPages;
  if (!totalPages || totalPages === 1) return null;
  return (
    <Wrapper>
      <Pagination
        boundaryRange={1}
        siblingRange={1}
        ellipsisItem={{
          content: <Icon name="ellipsis horizontal" />,
          icon: true,
        }}
        firstItem={{ content: <Icon name="angle double left" />, icon: true }}
        lastItem={{ content: <Icon name="angle double right" />, icon: true }}
        prevItem={{ content: <Icon name="angle left" />, icon: true }}
        nextItem={{ content: <Icon name="angle right" />, icon: true }}
        {...props}
      />
    </Wrapper>
  );
};

export default CustomPagination;

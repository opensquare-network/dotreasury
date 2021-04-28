import React from "react";
import { Icon, Pagination } from "semantic-ui-react";
import styled from "styled-components";

import { PRIMARY_THEME_COLOR } from "../constants";
import { SECONDARY_THEME_COLOR } from "../constants";

const Wrapper = styled.div`
  /* margin: 10px 0; */
  /* display: flex; */
  /* justify-content: flex-end; */

  a {
    font-family: "Inter" !important;
    outline: none !important;
    &.active {
      color: ${PRIMARY_THEME_COLOR} !important;
      background: ${SECONDARY_THEME_COLOR} !important;
    }
  }

  .pagination {
    border-top-right-radius: 0 !important;
    border-bottom-right-radius: 0 !important;
    height: 32px !important;
    min-height: 32px !important;
    border: 0 !important;
    box-shadow: none;
    > a {
      width: 32px !important;
      height: 32px !important;
      min-width: 32px !important;
      padding: 0 !important;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 0 !important;
      border-radius: 4px !important;
      ::before {
        display: none;
      }
      :not(:first-child) {
        margin-left: 8px !important;
      }
    }
  }
`;

const CustomPagination = (props) => {
  const totalPages = props.totalPages;
  if (!totalPages) return null;
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

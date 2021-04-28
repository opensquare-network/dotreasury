import React from "react";
import { Icon, Pagination } from "semantic-ui-react";
import styled from "styled-components";

import { PRIMARY_THEME_COLOR } from "../../constants";
import { SECONDARY_THEME_COLOR } from "../../constants";
import { TEXT_DARK_MINOR } from "../../constants";

const Wrapper = styled.div`
  margin: 10px 0;
  display: flex;
  justify-content: center;
  height: 32px;

  .ui.menu {
    border: 0px;
    box-shadow: none;
    .item:before {
      background-color: rgba(0, 0, 0, 0);
    }
  }

  a {
    width: 32px !important;
    height: 32px !important;
    min-width: 32px !important;
    padding: 0 !important;
    border: 0px;
    font-family: Inter !important;
    outline: none !important;
    color: ${TEXT_DARK_MINOR} !important;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    :not(:first-child) {
      margin-left: 8px;
    }
    &.active {
      color: ${PRIMARY_THEME_COLOR} !important;
      background: ${SECONDARY_THEME_COLOR} !important;
    }
  }
`;

const CommentPagination = (props) => {
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

export default CommentPagination;

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
  return (
    <Wrapper>
      <Pagination
        boundaryRange={1}
        siblingRange={0}
        ellipsisItem={{
          content: <Icon name="ellipsis horizontal" />,
          icon: true,
        }}
        // firstItem={{ content: <Icon name="angle double left" />, icon: true }}
        // lastItem={{ content: <Icon name="angle double right" />, icon: true }}
        firstItem={null}
        lastItem={null}
        {...props}
      />
    </Wrapper>
  );
};

export default CustomPagination;

import React from "react";
import styled from "styled-components";
import Pagination from "./Pagination";
import { Dropdown } from "semantic-ui-react";

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;

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
`;

const CustomDropdown = styled(Dropdown)`
  height: 42px !important;
  min-width: 72px !important;
  border-left: 0 !important;
  box-shadow: 0 1px 2px 0 rgb(34 36 38 / 15%) !important;
  border-top-left-radius: 0 !important;
  border-bottom-left-radius: 0 !important;
  border-color: rgba(34, 36, 38, 0.15) !important;
  padding: 8px !important;
  &:hover {
    border-color: rgba(34, 36, 38, 0.15) !important;
    background-color: #fbfbfb !important;
    & > i.dropdown.icon:before {
      color: rgba(29, 37, 60, 0.64) !important;
    }
  }
  &:active {
    border-color: rgba(34, 36, 38, 0.15) !important;
  }
  &:focus {
    border-color: rgba(34, 36, 38, 0.15) !important;
  }
  &.ui.upward.selection.dropdown.visible {
    border-top-left-radius: 0 !important;
    border-bottom-left-radius: 0 !important;
  }
  & > .visible.menu {
    border-color: rgba(34, 36, 38, 0.15) !important;
    max-height: none !important;
  }
  & > div.text {
    line-height: 24px !important;
    width: 32px !important;
    text-align: right;
  }
  & > i.dropdown.icon {
    margin-top: -8px !important;
    ::before {
      color: rgba(29, 37, 60, 0.24) !important;
    }
  }
  & .item {
    height: 40px !important;
    padding: 8px !important;
    & > .text {
      display: block;
      line-height: 24px !important;
      width: 32px !important;
      text-align: right !important;
    }
  }
`;

const options = [
  { key: 1, text: "20", value: 20 },
  { key: 2, text: "50", value: 50 },
  { key: 3, text: "100", value: 100 },
];

const ResponsivePagination = ({
  activePage,
  totalPages,
  onPageChange,
  pageSize,
  setPageSize,
}) => {
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
      {totalPages > 0 && (
        <CustomDropdown
          value={pageSize}
          options={options}
          selection
          onChange={(_, { value }) => {
            setPageSize(value);
          }}
        />
      )}
    </Container>
  );
};

export default ResponsivePagination;

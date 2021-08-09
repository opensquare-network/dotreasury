import React from "react";
import styled from "styled-components";
import Pagination from "./Pagination";
import { Dropdown } from "semantic-ui-react";

const Container = styled.div`
  padding: 16px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;

  @media screen and (max-width: 640px) {
    > div:first-child {
      display: none;
    }
  }

  @media screen and (min-width: 640px) {
    > div:nth-child(2) {
      display: none;
    }
  }

  @media screen and (max-width: 640px) {
    .hidden {
      display: none;
      width: 0 !important;
      height: 0 !important;
    }
  }
`;

const TextWrapper = styled.div`
  width: 153px;
  height: 24px;
`;

const DropdownWrapper = styled.div`
  width: 72px;
  height: 24px;
  margin-right: 0;
`;

const DropdownText = styled.div`
  font-size: 13px;
  line-height: 24px;
  color: rgba(0, 0, 0, 0.3);
  text-align: right;
  padding-right: 16px;
`;

const CustomDropdown = styled(Dropdown)`
  position: absolute !important;
  height: 24px !important;
  min-height: 24px !important;
  min-width: 72px !important;
  border-left: 0 !important;
  border: 1px solid #dddddd !important;
  padding: 3px 8px !important;

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
    line-height: 18px !important;
    font-size: 13px !important;
    width: 32px !important;
  }
  & > i.dropdown.icon {
    padding: 4px 12px !important;
    margin-top: -8px !important;
    ::before {
      color: rgba(29, 37, 60, 0.24) !important;
    }
  }
  & .item {
    height: 24px !important;
    padding: 0px 8px !important;
    & > .text {
      line-height: 24px !important;
      font-size: 13px !important;
      display: block;
      width: 32px !important;
      margin-top: -8px !important;
    }
  }
`;

const SelectWrapper = styled.div`
  display: flex;
  margin: 8px 0;
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
        <SelectWrapper>
          <TextWrapper className="hidden">
            <DropdownText>Show rows</DropdownText>
          </TextWrapper>
          <DropdownWrapper>
            <CustomDropdown
              value={pageSize}
              options={options}
              selection
              onChange={(_, { value }) => {
                setPageSize(value);
              }}
            />
          </DropdownWrapper>
        </SelectWrapper>
      )}
    </Container>
  );
};

export default ResponsivePagination;

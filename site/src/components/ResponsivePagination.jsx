import React from "react";
import styled from "styled-components";
import Pagination from "./Pagination";
import { Dropdown } from "semantic-ui-react";
import { useQueryParams } from "../utils/hooks";
import { useEffect } from "react";

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
  color: var(--textTertiary);
  text-align: right;
  padding-right: 16px;
`;

const CustomDropdown = styled(Dropdown)`
  position: absolute !important;
  height: 24px !important;
  min-height: 24px !important;
  min-width: 72px !important;
  border-left: 0 !important;
  border: 1px solid var(--neutral400) !important;
  padding: 3px 8px !important;
  background-color: transparent !important;

  .text {
    color: var(--textPrimary) !important;
  }

  &:hover {
    border-color: var(--neutral400) !important;
    & > i.dropdown.icon:before {
      color: var(--textSecondary) !important;
    }
  }
  &:active {
    border-color: var(--neutral400) !important;
  }
  &:focus {
    border-color: var(--neutral400) !important;
  }
  &.ui.upward.selection.dropdown.visible {
    border-top-left-radius: 0 !important;
    border-bottom-left-radius: 0 !important;
  }
  & > .visible.menu {
    border-color: var(--neutral400) !important;
    max-height: none !important;
    background-color: var(--neutral100) !important;
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
      color: var(--textTertiary) !important;
    }
  }
  & .item {
    height: 24px !important;
    padding: 0px 8px !important;
    border-color: var(--neutral300) !important;
    &:hover {
      background-color: var(--neutral300) !important;
    }
    &.selected {
      background-color: var(--neutral300) !important;
    }

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
  const { page = activePage } = useQueryParams();

  useEffect(() => {
    onPageChange(
      {},
      {
        activePage: page,
        totalPages,
      },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

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

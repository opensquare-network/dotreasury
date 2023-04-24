import styled from "styled-components";
import { Table as SemanticTable } from "semantic-ui-react";
import _get from "lodash.get";
import _set from "lodash.set";
import Text from "./Text";
import { useEffect, useState } from "react";
import TableNoDataCell from "./TableNoDataCell";
import IconMask from "./Icon/Mask";

const CustomTable = styled(SemanticTable)`
  overflow: hidden !important;
  border-radius: 8px !important;
  margin-top: 0 !important;
  border-color: var(--neutral300) !important;
  background-color: var(--neutral100) !important;
  tr {
    &.tree {
      background-color: rgba(250, 250, 250, 1);
    }
    :hover {
      background-color: var(--neutral200) !important;
    }
  }
  td {
    border-top: 0 !important;
    border-bottom: 1px solid var(--neutral300);
    padding: 12px 24px !important;
    color: var(--textTertiary) !important;
  }
  th {
    font-style: normal !important;
    font-weight: normal !important;
    font-size: 13px !important;
    font-family: "Inter" !important;
    border-bottom: 0 !important;
    padding: 12px 24px !important;
    background: var(--neutral200) !important;
    line-height: 18px !important;
    color: var(--textTertiary) !important;
  }
  .user-cell {
    width: 176px !important;
    max-width: 176px !important;
  }
  .balance-cell {
    width: 139px !important;
  }
  .status-cell {
    width: 140px !important;
  }
  .link-cell {
    width: 44px !important;
  }
  .time-cell {
    min-width: 180px !important;
  }
  .index-cell {
    width: 80px !important;
    max-width: 80px !important;
  }
  .title-cell {
    min-width: 208px !important;
    word-break: break-all;
  }
  .update-due-cell {
    min-width: 100px !important;
  }
  .payout-due-cell {
    min-width: 100px !important;
  }
  .propose-time-cell {
    width: 280px !important;
    max-width: 280px !important;
  }
  .related-links-cell {
    min-width: 120px !important;
  }
  .proposal-related-links-cell {
    width: 136px !important;
    max-width: 136px !important;
  }
  .description-cell {
    min-width: 432px !important;
  }
  .date-cell {
    min-width: 140px !important;
  }
  .proposal-description-cell {
    width: 340px !important;
    max-width: 340px !important;
  }
  .proposal-user-cell {
    /* max-width: 164px !important; */
  }
  .proposal-value-cell {
    width: 136px !important;
    max-width: 136px !important;
  }
  .proposal-status-cell {
    width: 136px !important;
    max-width: 136px !important;
  }
  .opengov-description-cell {
    width: 420px !important;
    max-width: 420px !important;
  }
  td:first-child {
    font-weight: 400 !important;
  }

  .short-padding {
    padding-top: 4px !important;
    padding-bottom: 4px !important;
  }
  .no-data {
    height: 120px !important;
  }
  @media screen and (max-width: 1141px) {
    .hidden {
      display: none;
    }
  }
`;
export default CustomTable;

const TreeToggleButton = styled.button`
  border: 1px solid var(--neutral400);
  background-color: transparent;
  border-radius: 4px;
  cursor: pointer;
  padding: 0;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const {
  Header: TableHeader,
  Row: TableRow,
  HeaderCell: TableHeaderCell,
  Body: TableBody,
  Cell: TableCell,
} = CustomTable;

function TableBodyRow({
  onClick,
  columns,
  tree,
  treeKey,
  treeDataTransform,
  item,
  className = "",
}) {
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    setExpanded(false);
  }, [item, setExpanded]);

  if (!item) {
    return null;
  }

  const renderCells = (columns) => {
    return columns.map((column, columnIndex) => {
      const {
        key = columnIndex,
        cellRender,
        dataIndex,
        cellClassName = "",
        cellProps = {},
        show = true,
        width,
      } = column;

      _set(cellProps, "style.width", width);
      const cellValue = _get(item, dataIndex);

      if (!show) {
        return null;
      }

      return (
        <TableCell key={key} {...cellProps} className={cellClassName}>
          {cellRender?.(cellValue, item) || <Text>{cellValue}</Text>}
        </TableCell>
      );
    });
  };

  const treeData = (_get(item, treeKey) ?? []).map(treeDataTransform);

  return (
    <>
      <TableRow onClick={() => onClick(item)} className={className}>
        {tree && (
          <TableCell>
            {!!treeData.length && (
              <TreeToggleButton
                onClick={(event) => {
                  event.stopPropagation();
                  setExpanded(!expanded);
                }}
              >
                <IconMask
                  src={`/imgs/${expanded ? "subtract" : "add"}.svg`}
                  color="textSecondary"
                  size={16}
                  alt="toggle"
                />
              </TreeToggleButton>
            )}
          </TableCell>
        )}
        {renderCells(columns)}
      </TableRow>

      {expanded &&
        treeData.map((item, index) => {
          return (
            <TableBodyRow
              key={index}
              onClick={onClick}
              item={item}
              columns={columns}
              tree={tree}
              treeKey={treeKey}
              treeDataTransform={treeDataTransform}
              className="tree"
            />
          );
        })}
    </>
  );
}

export function Table({
  data = [],
  columns = [],
  tree = false,
  treeKey = "children",
  treeDataTransform = (data) => data,
  onRowClick = () => {},
  colgroup,
}) {
  return (
    <CustomTable unstackable>
      {colgroup}
      <TableHeader>
        <TableRow>
          {tree && <TableHeaderCell />}

          {columns.map((column, index) => {
            const {
              key = index,
              title,
              headerCellProps = {},
              headerCellClassName = "",
              show = true,
              width,
            } = column;

            _set(headerCellProps, "style.width", width);

            if (!show) {
              return null;
            }

            return (
              <TableHeaderCell
                key={key}
                {...headerCellProps}
                className={headerCellClassName}
              >
                {title}
              </TableHeaderCell>
            );
          })}
        </TableRow>
      </TableHeader>

      <TableBody>
        {data.length ? (
          data.map((item, index) => {
            return (
              <TableBodyRow
                key={index}
                onClick={onRowClick}
                item={item}
                columns={columns}
                tree={tree}
                treeKey={treeKey}
                treeDataTransform={treeDataTransform}
              />
            );
          })
        ) : (
          <TableNoDataCell />
        )}
      </TableBody>
    </CustomTable>
  );
}

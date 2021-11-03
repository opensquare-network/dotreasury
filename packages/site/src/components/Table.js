import styled from "styled-components";
import { Table } from "semantic-ui-react";

const CustomTable = styled(Table)`
  overflow: hidden !important;
  border-radius: 8px !important;
  margin-top: 0 !important;
  border-color: #eee !important;
  tr {
    :hover {
      background-color: #fdfdfd !important;
    }
  }
  td {
    border-top: 0 !important;
    border-bottom: 1px solid #f4f4f4;
    padding: 12px 24px !important;
  }
  th {
    font-style: normal !important;
    font-weight: normal !important;
    font-size: 13px !important;
    font-family: "Inter" !important;
    border-bottom: 0 !important;
    padding: 12px 24px !important;
    background: #fafafa !important;
    line-height: 18px !important;
    color: rgba(0, 0, 0, 0.3) !important;
  }
  .user-cell {
    width: 192px !important;
    max-width: 192px !important;
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
    width: 60px !important;
  }
  .title-cell {
    min-width: 208px !important;
  }
  .update-due-cell {
    min-width: 100px !important;
  }
  .payout-due-cell {
    min-width: 100px !important;
  }
  .propose-time-cell {
    width: 280px !important;
  }
  .new-propose-time-cell {
    max-width: 180px !important;
  }
  .related-links-cell {
    min-width: 120px !important;
  }
  .proposal-related-links-cell {
    width: 160px !important;
    max-width: 160px !important;
  }
  .description-cell {
    min-width: 432px !important;
  }
  .date-cell {
    min-width: 140px !important;
  }
  .proposal-description-cell {
    width: 368px !important;
    max-width: 368px !important;
  }
  .proposal-user-cell {
    max-width: 164px !important;
  }
  .proposal-value-cell {
    max-width: 136px !important;
  }
  .proposal-status-cell {
    max-width: 128px !important;
  }
  td:first-child {
    font-weight: 400 !important;
  }
`;
export default CustomTable;

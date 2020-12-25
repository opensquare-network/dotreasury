import styled from "styled-components";
import { Table } from "semantic-ui-react";

import { TEXT_DARK_MINOR } from "../constants";

const CustomTable = styled(Table)`
  margin-top: 0 !important;
  td {
    border-top: 0 !important;
  }
  th {
    font-family: Inter !important;
    font-style: normal !important;
    font-weight: normal !important;
    font-size: 14px !important;
    border-bottom: 0 !important;
    color: ${TEXT_DARK_MINOR} !important;
  }
  .user-cell {
    width: 172px !important;
    max-width: 172px !important;
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
  td:first-child {
    font-weight: 400 !important;
  }
`;
export default CustomTable;

import styled from "styled-components";
import { Table } from "semantic-ui-react";

const CustomTable = styled(Table)`
  td {
    border-top: 0 !important;
  }
  th {
    font-family: Inter !important;
    font-style: normal !important;
    font-weight: normal !important;
    font-size: 14px !important;
    border-bottom: 0 !important;
    color: rgba(29, 37, 60, 0.64) !important;
  }
`;
export default CustomTable;

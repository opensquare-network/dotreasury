import styled from "styled-components";
import { Progress } from "semantic-ui-react";

const CustomProgress = styled(Progress)`
  min-width: 200px;
  height: 6px;
  margin: 0 !important;
  background: var(--secondary) !important;
  border-radius: 4px !important;
  flex: 1 1 auto !important;
  .bar {
    height: inherit !important;
    background: var(--primary) !important;
    border-radius: 4px !important;
    min-width: 0 !important;
  }
`;

export default CustomProgress;

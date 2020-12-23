import styled from "styled-components";
import { Progress } from "semantic-ui-react";

const CustomProgress = styled(Progress)`
  min-width: 228px;
  height: 6px;
  margin: 0 !important;
  background: #ffecef !important;
  border-radius: 4px !important;
  flex: 1 1 auto !important;
  .bar {
    height: inherit !important;
    background: #df405d !important;
    border-radius: 4px !important;
  }
`;

export default CustomProgress;

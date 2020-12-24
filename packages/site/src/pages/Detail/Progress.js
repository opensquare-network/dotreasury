import styled from "styled-components";
import { Progress } from "semantic-ui-react";

import { PRIMARY_THEME_COLOR, SECONDARY_THEME_COLOR } from "../../constants";

const CustomProgress = styled(Progress)`
  min-width: 200px;
  height: 6px;
  margin: 0 !important;
  background: ${SECONDARY_THEME_COLOR} !important;
  border-radius: 4px !important;
  flex: 1 1 auto !important;
  .bar {
    height: inherit !important;
    background: ${PRIMARY_THEME_COLOR} !important;
    border-radius: 4px !important;
  }
`;

export default CustomProgress;

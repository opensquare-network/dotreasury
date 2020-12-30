import styled from "styled-components";

import {PRIMARY_THEME_COLOR} from "../../constants"

const Bar = styled.div`
  width: 2px;
  margin: 0 11px;
  background: ${PRIMARY_THEME_COLOR};
  opacity: 0.5;
  flex: 0 0 auto;
`;

export default Bar;

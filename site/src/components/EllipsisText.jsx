import styled from "styled-components";

import Text from "./Text";

const EllipsisText = styled(Text)`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
export default EllipsisText;

import styled from "styled-components";
import { TextArea } from "semantic-ui-react";


const CustomTextArea = styled(TextArea)`
  min-height: 100px !important;
  &:focus {
    border-color: var(--primary) !important;
  }
`;

export default CustomTextArea;

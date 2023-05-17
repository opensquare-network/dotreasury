import styled from "styled-components";
import { border_hidden, w } from "../../styles/tailwindcss";
import { breakpoint } from "../../styles/responsive";

const SummaryOngoingItemWrapper = styled.div`
  border-right: 1px solid;
  border-color: var(--neutral300);
  ${w(209)};
  ${breakpoint(1112, border_hidden)};
`;

export default SummaryOngoingItemWrapper;

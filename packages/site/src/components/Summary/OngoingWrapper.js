import styled from "styled-components";
import { border_hidden, w } from "../../styles/tailwindcss";
import { breakpoint } from "../../styles/responsive";
import { Greyscale_Grey_200 } from "../../constants";

const SummaryOngoingItemWrapper = styled.div`
  border-right: 1px solid;
  border-color: ${Greyscale_Grey_200};
  ${w(209)};
  ${breakpoint(1112, border_hidden)};
`;

export default SummaryOngoingItemWrapper;

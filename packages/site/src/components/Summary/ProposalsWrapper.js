import styled from "styled-components";
import Card from "../Card";
import {
  flex,
  flex_col,
  gap_x,
  gap_y,
  m_b,
  p,
  rounded_8,
  rounded_none,
} from "../../styles/tailwindcss";
import { breakpoint } from "../../styles/responsive";

const SummaryProposalsWrapper = styled(Card)`
  ${flex};
  ${p(24)};
  ${rounded_8};
  ${m_b(16)};
  ${gap_x(128)};

  ${breakpoint(1305, gap_x(64))};
  ${breakpoint(1112, `${flex_col}${gap_y(16)}`)};
  ${breakpoint(600, rounded_none)};
`;

export default SummaryProposalsWrapper;

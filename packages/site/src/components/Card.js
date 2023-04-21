import styled from "styled-components";
import { shadow_100 } from "../styles/tailwindcss";

const Card = styled.div`
  background-color: var(--neutral100);
  border-radius: 8px;
  border: 1px solid var(--neutral300);
  padding: 8px 0;
  ${shadow_100};
`;

export default Card;

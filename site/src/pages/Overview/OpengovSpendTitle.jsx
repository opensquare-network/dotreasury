import styled from "styled-components";
import Tooltip from "../../components/Tooltip";
import { p_12_normal } from "../../styles/text";
import { inline_flex, items_center } from "../../styles/tailwindcss";
import IconMask from "../../components/Icon/Mask";

const Content = styled.span`
  ${p_12_normal};
`;

const Wrapper = styled.div`
  ${inline_flex};
  ${items_center};
`;

export default function OpengovSpendTitle({ children }) {
  return (
    <Wrapper>
      <div>{children}</div>
      <Tooltip
        tooltipContent={
          <Content>Only treasury proposals are taken into account</Content>
        }
      >
        <IconMask src="/imgs/tooltip.svg" size={24} color="textTertiary" />
      </Tooltip>
    </Wrapper>
  );
}

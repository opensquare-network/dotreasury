import styled, { css } from "styled-components";

import { Tertiary_Blue_500, Tertiary_Green_500 } from "../../constants";

const Text = styled.span`
  font-family: "Inter", serif;
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  line-height: 18px;
  ${(props) => {
    return (
      props &&
      props.color &&
      css`
        color: ${props.color};
      `
    );
  }}
  margin: 0;
`;

export default function Tag({ text, className }) {
  let color = "var(--textTertiary)";
  if (text === "Working") {
    color = Tertiary_Green_500;
  }
  if (text === "Review") {
    color = Tertiary_Blue_500;
  }
  return (
    <Text color={color} className={className}>
      {text}
    </Text>
  );
}

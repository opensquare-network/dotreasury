import styled, { css } from "styled-components";

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
    color = "var(--green500)";
  }
  if (text === "Review") {
    color = "var(--blue500)";
  }
  return (
    <Text color={color} className={className}>
      {text}
    </Text>
  );
}

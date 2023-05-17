import styled, { css } from "styled-components";
import { mrgap } from "../../styles";
import Title from "../../components/Title";
import { useHistory } from "react-router-dom";
import IconMask from "../../components/Icon/Mask";
import { inline_flex } from "../../styles/tailwindcss";

const HeaderWrapper = styled.div`
  display: flex;
  align-items: center;
  ${css`
    ${mrgap("16px")}
  `}
  margin-bottom: 20px;
  div:first-child {
    cursor: pointer;
    ${inline_flex};
  }
`;

export default function DetailGoBack() {
  const history = useHistory();

  return (
    <HeaderWrapper>
      <div onClick={() => history.goBack()}>
        <IconMask src="/imgs/back.svg" size={32} color="textPrimary" />
      </div>
      <Title>Detail</Title>
    </HeaderWrapper>
  );
}

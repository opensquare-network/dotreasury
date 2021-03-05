import styled, { css } from "styled-components";
import { mrgap } from "../../styles";
import { Image } from "semantic-ui-react";
import Title from "../../components/Title";
import { useHistory } from "react-router-dom";

const HeaderWrapper = styled.div`
  display: flex;
  align-items: center;
  ${css`
    ${mrgap("16px")}
  `}
  margin-bottom: 20px;
  div:first-child {
    cursor: pointer;
  }
`;

export default function DetailGoBack() {
  const history = useHistory();

  return (
    <HeaderWrapper>
      <div onClick={() => history.goBack()}>
        <Image src="/imgs/back.svg" width={"32px"} height={"32px"} />
      </div>
      <Title>Detail</Title>
    </HeaderWrapper>
  );
}

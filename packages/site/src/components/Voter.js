import React from "react";
import styled, { css } from "styled-components";
import { Image } from "semantic-ui-react";

import User from "./User";
import Text from "./Text";
import { mrgap } from "../styles";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
`

const PassWrapper = styled.div`
  display: flex;
  align-items: center;
  word-break: normal;
  ${css`${mrgap("8px")}`}
`

const ImageWrapper = styled.div`
  width: 16px;
  height: 16px;
`

const Voter = ({address, agree, value}) => {
  return (
    <Wrapper>
      <User address={address} />
      <PassWrapper>
        <Text>{value}</Text>
        {
          (agree !== null && agree !== undefined) && (
            <ImageWrapper>
              <Image src={agree === true ? "/imgs/circle-pass.svg" : (agree === false ? "/imgs/circle-reject.svg": "")} />
            </ImageWrapper>
          )
        }
      </PassWrapper>
    </Wrapper>
  )
}

export default Voter;

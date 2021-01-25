import React from "react";
import styled from "styled-components";
import { Image } from "semantic-ui-react";
import dayjs from "dayjs";

import Text from "../../components/Text";
import TextMinor from "../../components/TextMinor";
import TextDisable from "../../components/TextDisable";
import Markdown from "../../components/Markdown";
import { PRIMARY_THEME_COLOR, SECONDARY_THEME_COLOR } from "../../constants";

const Wrapper = styled.div`
  padding: 32px 32px 16px;
  :hover {
    background: #FBFBFB;
  }
`

const HeaderWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
`

const Avatar = styled(Image)`
  margin-right: 8px;
`

const Username = styled(TextMinor)`
  margin-right: 16px;
`

const Index = styled(TextMinor)`
  background: #FBFBFB;
  border-radius: 10px;
  height: 20px;
  padding: 0 8px;
  line-height: 20px;
  margin-left: auto;
  font-size: 12px;
`

const TopLabel = styled(Text)`
  background: ${SECONDARY_THEME_COLOR};
  color: ${PRIMARY_THEME_COLOR};
  line-height: 20px;
  font-size: 12px;
  padding: 0 8px;
  border-radius: 10px;
  margin-left: 8px;
`

const ContnetWrapper = styled.div`
  margin-left: 32px;
`

const ButtonList = styled.div`
  display: flex;
  align-items: center;
`

const Button = styled.div`
  cursor: pointer;
  opacity: 0.24;
  :not(:last-child) {
    margin-right: 8px;
  }
  :hover {
    opacity: 0.64;
  }
`

const ReplayButton = styled(Button)`
  display: flex;
  align-items: center;
  margin-right: 16px !important;
  & > :first-child {
    margin-right: 5px;
  }
`

const CommentItem = ({comment, index}) => {
  const isTop = false;
  return (<Wrapper>
    <HeaderWrapper>
      <Avatar src="/imgs/avatar.png" />
      <Username>{comment.author.username}</Username>
      <TextDisable>{dayjs(comment.createdAt).format(
        "YYYY-MM-DD HH:mm:ss"
      )}</TextDisable>
      <Index>#{index + 1}</Index>
      { isTop && <TopLabel>top</TopLabel> }
    </HeaderWrapper>
    <ContnetWrapper>
      <Markdown md={comment.content} />
      <ButtonList>
        <ReplayButton>
          <Image src="/imgs/reply.svg" />
          <Text>Reply</Text>
        </ReplayButton>
        <Button><Image src="/imgs/thumb-up.svg" /></Button>
        <Button><Image src="/imgs/thumb-down.svg" /></Button>
      </ButtonList>
    </ContnetWrapper>
  </Wrapper>)
}

export default CommentItem;

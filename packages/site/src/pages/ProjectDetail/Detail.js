import React from "react";
import styled from "styled-components";
import { Image } from "semantic-ui-react";

import Card from "../../components/Card";
import Title from "../../components/Title";
import Text from "../../components/Text";
import TextMinor from "../../components/TextMinor";

const Wrapper = styled(Card)`
  padding: 24px 32px;
  margin-bottom: 32px;
  display: flex;
  align-items: flex-start;
  flex-wrap: wrap;
  @media screen and (max-width: 481px) {
     & * {
       text-align: left !important;
     }
  }
`

const IconImage = styled(Image)`
  margin-right: 32px;
`

const NameContentWrapper = styled.div`
  flex-grow: 1;
`
const NameWrapper = styled.div`
  display: flex;
  align-items: center;
`

const NameTitle = styled(Title)`
  font-size: 22px;
  font-weight: 700;
  line-height: 36px;
`

// const NameTag = styled.div`
//   background: #EBFBFA;
//   border-radius: 4px;
//   padding: 0 8px;
//   margin-left: 16px;
//   font-family: "Inter";
//   font-size: 12px;
//   line-height: 20px;
//   color: #04D2C5;
// `

const NameContent = styled(TextMinor)`
  max-width: 512px;
`

const ProposalWrapper = styled.div`
  margin-left: 32px;
  flex-basis: 160px;
  @media screen and (max-width: 481px) {
    margin-left: 0;
    margin-right: 32px;
  }
`

const CustomText = styled(Text)`
  font-size: 18px;
  font-weight: 700;
  line-height: 32px;
  text-align: right;
`

const CustomTextMinor = styled(TextMinor)`
  padding-top: 6px;
  text-align: right;
`

const ExpenseContentWrapper = styled.div`
  margin-left: 32px;
  flex-basis: 160px;
  @media screen and (max-width: 481px) {
    margin-left: 0;
    margin-right: 32px;
  }
`

const UnitText = styled(TextMinor)`
  font-size: 18px;
  font-weight: 700;
  line-height: 32px;
  margin-left: 8px;
`

const ExpenseWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  @media screen and (max-width: 481px) {
    justify-content: flex-start;
  }
`

const DollarText = styled(TextMinor)`
  text-align: right;
`

const Detail = ({ data }) => {
  const { name, logo, description, proposals, expense, dollar} = data;
  return (
    <Wrapper>
      <IconImage src={logo ? `/imgs/projects/${logo}` : "/imgs/opensquare-icon-logo.svg"} width={96} height={96} />
      <NameContentWrapper>
        <NameWrapper>
          <NameTitle>{name}</NameTitle>
          {/* <NameTag>OSN</NameTag> */}
        </NameWrapper>
        <NameContent>{description}</NameContent>
      </NameContentWrapper>
      <ProposalWrapper>
        <CustomTextMinor>Proposals</CustomTextMinor>
        <CustomText>{proposals ?? 0}</CustomText>
      </ProposalWrapper>
      <ExpenseContentWrapper>
        <CustomTextMinor>Expense</CustomTextMinor>
        <ExpenseWrapper>
          <CustomText>{expense ?? 0}</CustomText>
          <UnitText>KSM</UnitText>
        </ExpenseWrapper>
        {dollar && <DollarText>{`≈ $${dollar}`}</DollarText>}
      </ExpenseContentWrapper>
    </Wrapper>
  )
}

export default Detail;

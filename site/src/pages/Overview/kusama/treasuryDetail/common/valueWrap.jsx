import SkeletonBar from "../../../../../components/skeleton/bar";
import { abbreviateBigNumber, toPrecision } from "../../../../../utils";
import styled, { css } from "styled-components";
import { mrgap } from "../../../../../styles";
import Text from "../../../../../components/Text";
import TextMinor from "../../../../../components/TextMinor";
import { h3_18_semibold } from "../../../../../styles/text";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  color: var(--textPrimary);
  ${css`
    ${mrgap("4px")}
  `}
`;

const TextBold = styled(Text)`
  ${h3_18_semibold};
`;

const TextAccessoryBold = styled(TextMinor)`
  ${h3_18_semibold};
  color: var(--textTertiary);
`;

export default function ValueWrap({ balance, symbol, isLoading, decimals }) {
  if (isLoading) {
    return <SkeletonBar width={160} height={22} style={{ margin: "3px 0" }} />;
  }

  const amount = abbreviateBigNumber(toPrecision(balance, decimals));
  return (
    <Wrapper>
      <TextBold>{amount}</TextBold>
      <TextAccessoryBold>{symbol}</TextAccessoryBold>
    </Wrapper>
  );
}

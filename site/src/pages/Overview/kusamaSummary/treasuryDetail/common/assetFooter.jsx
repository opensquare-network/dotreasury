import SkeletonBar from "../../../../../components/skeleton/bar";
import { abbreviateBigNumber } from "../../../../../utils";
import styled from "styled-components";
import Text from "../../../../../components/Text";
import { p_12_medium } from "../../../../../styles/text";

const Wrapper = styled(Text)`
  ${p_12_medium};
  color: var(--textTertiary);
`;

export default function AssetFooter({
  balance,
  isLoading,
  prefix = "",
  suffix = "",
}) {
  if (isLoading) {
    return <SkeletonBar width={160} height={22} style={{ margin: "3px 0" }} />;
  }

  return (
    <Wrapper>
      {prefix}
      {balance && "≈ "}${abbreviateBigNumber(balance)}
      {suffix}
    </Wrapper>
  );
}

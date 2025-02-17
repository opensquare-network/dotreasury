import SkeletonBar from "../../../../../components/skeleton/bar";
import { abbreviateBigNumber } from "../../../../../utils";
import styled from "styled-components";
import Text from "../../../../../components/Text";
import { p_12_normal } from "../../../../../styles/text";

const Wrapper = styled(Text)`
  ${p_12_normal};
  color: var(--textTertiary);
`;

export default function ValueInfo({ balance, symbolPrice, isLoading }) {
  if (isLoading) {
    return <SkeletonBar width={160} height={22} style={{ margin: "3px 0" }} />;
  }

  return (
    <Wrapper>
      {balance && "≈ "}${abbreviateBigNumber(balance * symbolPrice)}
    </Wrapper>
  );
}

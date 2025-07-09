import styled from "styled-components";
import { p_14_medium, p_14_semibold } from "../../styles/text";
import ExternalLink from "../ExternalLink";
import useTreasuryRequestingData from "../../hooks/overview/useTreasuryRequestingData";
import ValueDisplay from "../ValueDisplay";
import IconMask from "../Icon/Mask";
import { useSessionStorage } from "react-use";
import SkeletonBar from "../skeleton/bar";
import { currentChain } from "../../utils/chains";
import { CHAINS } from "../../utils/chains";
import { memo } from "react";

const Wrapper = styled.div`
  margin-top: 24px;
  background-color: var(--pink100);
  color: var(--pink500);
  padding: 12px;
  border-radius: 4px;
  display: flex;
  gap: 8px;
  justify-content: space-between;
`;

const WrapperBody = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  ${p_14_medium}
`;

const CloseButton = styled(IconMask)`
  cursor: pointer;
  flex-shrink: 0;
`;

const BoldSpan = styled.span`
  ${p_14_semibold}
`;

const Link = styled(ExternalLink)`
  color: var(--pink500);
  cursor: pointer;
  ${p_14_semibold}
  &:hover {
    color: var(--pink600);
    text-decoration: underline;
  }
`;

function TreasuryRequestingMessage({ onClose }) {
  const { requestingValue, confirmingValue, loading } =
    useTreasuryRequestingData();

  if (loading) {
    return <SkeletonBar style={{ marginTop: 24 }} height={44} />;
  }

  return (
    <Wrapper>
      <WrapperBody>
        <span>Treasury Requesting:</span>
        <span>Confirming</span>
        <BoldSpan>
          <ValueDisplay value={confirmingValue} prefix={"$"} />
        </BoldSpan>
        <span>·</span>
        <span>Requesting</span>
        <BoldSpan>
          <ValueDisplay value={requestingValue} prefix={"$"} />
        </BoldSpan>

        <span>·</span>
        <Link
          externalIcon
          externalIconColor="pink500"
          href={`https://${currentChain}.subsquare.io/referenda?is_treasury=true&ongoing=true`}
        >
          <BoldSpan>Check on SubSquare </BoldSpan>
        </Link>
      </WrapperBody>
      <CloseButton
        role="button"
        src="/imgs/close-error.svg"
        color="pink500"
        size={20}
        alt="menu"
        onClick={onClose}
      />
    </Wrapper>
  );
}

export default memo(function TreasuryRequestingMessageWrapper() {
  const [visible, setVisible] = useSessionStorage(
    "TreasuryRequestingMessage",
    true,
  );

  if (![CHAINS.polkadot.value].includes(currentChain) || !visible) {
    return null;
  }

  return <TreasuryRequestingMessage onClose={() => setVisible(false)} />;
});

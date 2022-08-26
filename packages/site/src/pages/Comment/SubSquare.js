import { useSelector } from "react-redux";
import styled from "styled-components";
import ButtonPrimary from "../../components/ButtonPrimary";
import { chainSelector } from "../../store/reducers/chainSlice";
import { ReactComponent as JumpSVG } from "./jump.svg";

const Wrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  margin: 24px;
`;

const ButtonContent = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
`;

export default function SubSquare({ type, index}) {
  const chain = useSelector(chainSelector);

  let link = "";
  if (type === "proposal") {
    link = `https://${chain}.subsquare.io/treasury/proposal/${index}`;
  } else if (type === "bounty") {
    link = `https://${chain}.subsquare.io/treasury/bounty/${index}`;
  } else if (type === "tip") {
    link = `https://${chain}.subsquare.io/treasury/tip/${index}`;
  } else if (type === "child-bounty") {
    link = `https://${chain}.subsquare.io/treasury/child-bounty/${index}`;
  }

  return (
    <Wrapper>
      <a target="_blank" rel="noreferrer" href={link}>
        <ButtonPrimary>
          <ButtonContent>
            <div>SubSquare</div>
            <JumpSVG/>
          </ButtonContent>
        </ButtonPrimary>
      </a>
    </Wrapper>
  );
}

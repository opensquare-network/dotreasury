import styled, { css } from "styled-components";
import { Modal } from "semantic-ui-react";
import { ReactComponent as CloseSVG } from "./close.svg";

const StyledModal = styled(Modal)`
  padding: 32px;
  > :nth-child(1) {
    margin-bottom: 16px;
  }

  ${p => p.maxwidth && css`
    max-width: ${p.maxwidth}px;
  `}

  @media screen and (max-width: 600px) {
    .address {
      display: none;
    }
    & {
      padding: 16px !important;
    }
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.div`
  font-style: normal;
  font-weight: 600;
  font-size: 18px;
  line-height: 28px;
  color: var(--textPrimary);
`;

const Close = styled(CloseSVG)`
  cursor: pointer;
`;

export default function ActionModal({ title, visible, setVisible, children, size = "small", maxWidth }) {
  return (
    <StyledModal
      size={size}
      open={visible}
      onClose={() => setVisible(false)}
      maxwidth={maxWidth}
    >
      <Header>
        <Title>{title}</Title>
        <Close onClick={() => setVisible(false)} />
      </Header>
      {children}
    </StyledModal>
  );}

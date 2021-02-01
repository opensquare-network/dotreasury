import React, { useState } from "react";
import styled from "styled-components";
import { Modal, Image } from "semantic-ui-react";
import { useForm } from "react-hook-form";
import { Form } from "semantic-ui-react";

import { StyledItem, StyledTitle } from "./components";
import TextMinor from "../../components/TextMinor";
import ButtonPrimary from "../../components/ButtonPrimary";
import { SECONDARY_THEME_COLOR, WARNING_COLOR } from "../../constants";
import Card from "../../components/Card";
import Title from "../../components/Title";
import Text from "../../components/Text";
import FormInput from "../../components/FormInput";

const StyledTextMinor = styled(TextMinor)`
  margin-bottom: 16px;
`

const StyledButtonPrimary = styled(ButtonPrimary)`
  width: 100%;
  background: ${WARNING_COLOR} !important;
  &.ui.button:hover, &.ui.button:active, &.ui.button:focus {
    background: ${WARNING_COLOR} !important;
  }
`

const StyledCard = styled(Card)`
  padding: 32px !important;
`

const CloseButton = styled(Image)`
  position: absolute !important;
  top: 42px;
  right: 32px;
  cursor: pointer;
`

const StyledModal = styled(Modal)`
  width: 424px !important;
  border-radius: 8px !important;
`

const StyledModalTitle = styled(Title)`
  text-align: center;
  margin-bottom: 24px;
`

const WarningText = styled(Text)`
  padding: 12px 20px;
  color: ${WARNING_COLOR};
  background: ${SECONDARY_THEME_COLOR};
  border-radius: 4px;
  margin-bottom: 24px;
`

const StyledModalButtonPrimary = styled(ButtonPrimary)`
  width: 100%;
  margin-top: 24px !important;
`

const DeleteAccount = () => {
  const [open, setOpen] = useState(false);
  const closeModal = () => {
    setOpen(false);
  }
  const { register, handleSubmit } = useForm();

  const onSubmit = async (formData) => {
    console.log(formData);
  };

  return (
    <StyledItem>
      <StyledTitle>
        Delete account
      </StyledTitle>
      <StyledTextMinor>
        Once you delete  your account, there is no going back. Please be certain.
      </StyledTextMinor>
      <StyledModal
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        open={open}
        trigger={<StyledButtonPrimary>Delete my account</StyledButtonPrimary>}
      >
        <StyledCard>
          <CloseButton src="/imgs/close.svg" onClick={() => closeModal()} />
          <StyledModalTitle>Delete account</StyledModalTitle>
          <WarningText>This action cannot be undone. This will permanently delete your account. Please type your password to confirm.</WarningText>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Field>
              <StyledTitle>
                Password
              </StyledTitle>
                <FormInput
                  name="password"
                  type="password"
                  placeholder="Please fill password"
                  ref={register({
                    required: true
                  })}
                />
                <StyledModalButtonPrimary type="submit">Delete my account</StyledModalButtonPrimary>
            </Form.Field>
          </Form>
        </StyledCard>
      </StyledModal>
    </StyledItem>
  )
}

export default DeleteAccount;

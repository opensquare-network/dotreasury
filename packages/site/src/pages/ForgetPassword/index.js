import React, { useState } from "react";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import { Form } from "semantic-ui-react";
import { Redirect } from "react-router-dom";

import scanApi from "../../services/scanApi";
import Card from "../../components/Card";
import Text from "../../components/Text";
import { TEXT_DARK_MAJOR } from "../../constants";
import FormInput from "../../components/FormInput";
import ButtonPrimary from "../../components/ButtonPrimary";
import FormError from "../../components/FormError";
import { useIsMounted } from "../../utils/hooks";
import TextMinor from "../../components/TextMinor";
import Divider from "../../components/Divider";

const CardWrapper = styled(Card)`
  max-width: 424px;
  margin: auto;
  margin-top: 28px;
  padding: 20px;
  padding: 32px;
  label {
    color: ${TEXT_DARK_MAJOR} !important;
    font-weight: 500 !important;
    line-height: 24px !important;
    margin-bottom: 8px !important;
  }
  .field:not(:last-child) {
    margin-bottom: 24px !important;
  }
  .field:nth-child(3) {
    margin-bottom: 8px !important;
  }
  @media screen and (max-width: 408px) {
    padding: 32px 16px;
  }
`;

const Header = styled(Text)`
  font-family: "Montserrat";
  font-size: 28px;
  font-weight: bold;
  line-height: 44px;
  margin-bottom: 24px;
  text-align: center;
`;

const StyledButtonPrimary = styled(ButtonPrimary)`
  width: 100%;
  margin-bottom: 16px !important;
`;

const TextWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 12px;
  padding-bottom: 12px;
  padding-left: 20px;
  padding-right: 20px;
  background: rgba(251, 251, 251, 1);
  margin-bottom: 24px;
`;

const StyledDivider = styled(Divider)`
  margin: 0 !important;
`;

const TimeText = styled(TextMinor)`
  margin-left: 8px;
  color: #f00;
`;

function ForgetPassword({ history }) {
  const { register, handleSubmit, errors } = useForm();
  const isMounted = useIsMounted();
  const [requested, setRequested] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const [serverError, setServerError] = useState("");

  if (requested) {
    if (countdown !== 0) {
      setTimeout(() => {
        if (isMounted.current) {
          setCountdown(countdown - 1);
        }
      }, 1000);
    }
  }

  // Request reset
  const onSubmit = async (formData) => {
    const { result, error } = await scanApi.fetch(
      "/auth/forget",
      {},
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: formData.email }),
      }
    );

    if (result) {
      if (isMounted.current) {
        setRequested(true);
      }
    }
    if (error) {
      if (isMounted.current) {
        setServerError(error.message);
      }
    }
  };

  return (
    <CardWrapper>
      <Header>Reset password</Header>
      {requested ? (
        <>
          <TextWrapper>
            <TextMinor>
              The reset password link was sent to your mailbox, if the account
              is exists.
            </TextMinor>
          </TextWrapper>
          <StyledButtonPrimary
            onClick={() => {
              history.push("/");
            }}
          >
            Got it
          </StyledButtonPrimary>
          <StyledDivider />
          <TextWrapper>
            The page will be re-directed in
            <TimeText>{countdown}s</TimeText>
          </TextWrapper>
          {countdown === 0 && <Redirect to="/" />}
        </>
      ) : (
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Field>
            <label htmlFor="email">
              Email
            </label>
            <FormInput
              name="email"
              type="text"
              placeholder="Email"
              ref={register({
                required: {
                  value: true,
                  message: "This field is required"
                },
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "invalid email address",
                },
              })}
              error={errors.email}
            />
            {errors.email && <FormError>{errors.email?.message}</FormError>}
            {serverError && <FormError>{serverError}</FormError>}
          </Form.Field>
          <StyledButtonPrimary type="submit">Request reset</StyledButtonPrimary>
        </Form>
      )}
    </CardWrapper>
  );
}

export default ForgetPassword;

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import { Form } from "semantic-ui-react";
import { Redirect } from "react-router-dom";
import queryString from "query-string";

import scanApi from "../../services/scanApi";
import Card from "../../components/Card";
import Text from "../../components/Text";
import { TEXT_DARK_MAJOR, PRIMARY_THEME_COLOR } from "../../constants";
import FormInput from "../../components/FormInput";
import ButtonPrimary from "../../components/ButtonPrimary";
import FormError from "../../components/FormError";
import { useIsMounted } from "../../utils/hooks";
import TextMinor from "../../components/TextMinor";
import FormPasswordWrapper from "../../components/FormPasswordWrapper";
import Divider from "../../components/Divider";

const CardWrapper = styled(Card)`
  max-width: 424px;
  margin: auto;
  margin-top: 28px;
  padding: 20px;
  padding: 32px;
  .ui.form input:focus {
    border-color: ${PRIMARY_THEME_COLOR} !important;
  }
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

function ResetPassword({ history, location }) {
  const { register, handleSubmit, errors } = useForm();
  const isMounted = useIsMounted();
  const [reset, setReset] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const [serverError, setServerError] = useState("");

  if (reset) {
    if (countdown !== 0) {
      setTimeout(() => {
        if (isMounted.current) {
          setCountdown(countdown - 1);
        }
      }, 1000);
    }
  }

  const q = queryString.parse(location.search);
  if (!q.email || !q.token) {
    return <Redirect to="/" />;
  }

  // Reset password
  const onSubmit = async (formData) => {
    const { result, error } = await scanApi.fetch(
      "/auth/reset",
      {},
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: q.email,
          token: q.token,
          newPassword: formData.password,
        }),
      }
    );

    if (result) {
      if (isMounted.current) {
        setReset(true);
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
      <Header>{reset ? "Congrats" : "Reset password"}</Header>
      {reset ? (
        <>
          <TextWrapper>
            <TextMinor>
              Your password has been reset, please login with you new password.
            </TextMinor>
          </TextWrapper>
          <StyledButtonPrimary
            onClick={() => {
              history.push("/login");
            }}
          >
            Got it
          </StyledButtonPrimary>
          <StyledDivider />
          <TextWrapper>
            The page will be re-directed in
            <TimeText>{countdown}s</TimeText>
          </TextWrapper>
          {countdown === 0 && <Redirect to="/login" />}
        </>
      ) : (
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Field>
            <label htmlFor="password">
              New password
              {errors.password && (
                <span>
                  <span>*</span>
                </span>
              )}
            </label>
            <FormPasswordWrapper
              show={showPassword}
              toggleClick={() => setShowPassword(!showPassword)}
            >
              <FormInput
                name="password"
                type={showPassword ? "text" : "password"}
                ref={register({ required: true })}
                autocomplete="off"
                error={errors.password}
              />
            </FormPasswordWrapper>
            {errors.password && <FormError>error message</FormError>}
          </Form.Field>
          {serverError && <FormError>{serverError}</FormError>}
          <StyledButtonPrimary type="submit">Confirm</StyledButtonPrimary>
        </Form>
      )}
    </CardWrapper>
  );
}

export default ResetPassword;

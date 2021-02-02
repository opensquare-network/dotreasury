import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import styled, { css } from "styled-components";
import { Form } from "semantic-ui-react";
import { Link } from "react-router-dom";

import { setLoggedInUser } from "../../store/reducers/userSlice";
import scanApi from "../../services/scanApi";
import Card from "../../components/Card";
import Text from "../../components/Text";
import {
  TEXT_DARK_MAJOR,
  TEXT_DARK_MINOR,
  PRIMARY_THEME_COLOR,
} from "../../constants";
import FormInput from "../../components/FormInput";
import FormPasswordWrapper from "../../components/FormPasswordWrapper";
import ButtonPrimary from "../../components/ButtonPrimary";
import Button from "../../components/Button";
import GrayImage from "../../components/GrayImage";
import TextMinor from "../../components/TextMinor";
import DownloadPolkadot from "../../components/DownloadPolkadot";
import AccountSelector from "../../components/AccountSelector";
import FormError from "../../components/FormError";
import Divider from "../../components/Divider";

const CardWrapper = styled(Card)`
  max-width: 424px;
  margin: auto;
  margin-top: 28px;
  padding: 20px;
  padding: 32px;
  /* .ui.form input:focus {
    border-color: ${PRIMARY_THEME_COLOR} !important;
  } */
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

const HelperWrapper = styled.div`
  display: flex;
  align-items: start;
  & > div > * {
    margin-bottom: 0;
    display: inline;
    word-wrap: break-word;
  }
`;

const HelperErrorWrapper = styled.div`
  margin-bottom: 24px;
`

const StyledTextMnor = styled(TextMinor)`
  text-decoration: underline;
  display: inline;
`;

const CheckImage = styled(GrayImage)`
  padding: 4px 8px 4px 0;
  ${(p) =>
    p.checked &&
    css`
      -webkit-filter: grayscale(0);
      filter: grayscale(0);
      opacity: 1;
    `}
  cursor: pointer;
`;

const StyledButtonPrimary = styled(ButtonPrimary)`
  width: 100%;
  margin-bottom: 16px !important;
`;

const StyledButton = styled(Button)`
  width: 100%;
  margin-bottom: 24px !important;
`;

const StyledDivider = styled(Divider)`
  margin: 0 !important;
`;

const LoginWrapper = styled.div`
  margin-top: 16px;
  line-height: 24px;
  text-align: center;
  color: ${TEXT_DARK_MINOR};
`;

const StyledLink = styled(Link)`
  margin-left: 8px;
  color: ${PRIMARY_THEME_COLOR};
  :hover {
    color: ${PRIMARY_THEME_COLOR};
  }
`;

const Helper = ({ isAgree, setIsAgree, agreeError, setAgreeError }) => {
  return (
    <HelperErrorWrapper>
      <HelperWrapper>
        <CheckImage
          src="/imgs/circle-pass.svg"
          checked={isAgree}
          onClick={() => {
            if (!isAgree) {
              setAgreeError(false);
            }
            setIsAgree(!isAgree);
          }}
        />
        <div>
          <p>I have read and agree to the terms of the </p>
          <Link to="/register">
            <StyledTextMnor>User Agreement</StyledTextMnor>
          </Link>
          <p> and </p>
          <Link to="/register">
            <StyledTextMnor>Privacy Notice.</StyledTextMnor>
          </Link>
        </div>
      </HelperWrapper>
      {agreeError && <FormError>This field is required</FormError>}
    </HelperErrorWrapper>
  );
};

function Register({ history }) {
  const [web3Login, setWeb3Login] = useState(false);
  const [hasExtension] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isAgree, setIsAgree] = useState(false);
  const [agreeError, setAgreeError] = useState(false);
  const { register, handleSubmit, errors } = useForm();
  const dispatch = useDispatch();
  const [serverError, setServerError] = useState("");

  // Do login
  const onSubmit = async (formData) => {
    if (!isAgree) {
      setAgreeError(true);
      return;
    }
    const {result: signupResult, error: signupError} = await scanApi.signup(
      formData.username,
      formData.email,
      formData.password
    );
    if (signupError) {
      setServerError(signupError.message);
    } else {
      saveLoggedInResult(signupResult);
      history.push("/login");
    }
  };

  const saveLoggedInResult = (loginResult) => {
    const loggedInUser = {
      username: loginResult.username,
      email: loginResult.email,
    };
    dispatch(setLoggedInUser(loggedInUser));

    localStorage.setItem(
      "token",
      JSON.stringify({
        accessToken: loginResult.accessToken,
        refreshToken: loginResult.refreshToken,
      })
    );
  };

  return (
    <CardWrapper>
      <Header>Sign up</Header>
      {!web3Login && (
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Field>
            <label htmlFor="username">
              Username
            </label>
            <FormInput
              name="username"
              type="text"
              ref={register({
                required: {
                  value: true,
                  message: "This field is required"
                }
              })}
              error={errors.username}
            />
            {errors.username && <FormError>{errors.username.message}</FormError>}
          </Form.Field>
          <Form.Field>
            <label htmlFor="email">
              Email
            </label>
            <FormInput
              name="email"
              type="text"
              ref={register({
                required: {
                  value: true,
                  message: "This field is required"
                }
              })}
              error={errors.email}
            />
            {errors.email && <FormError>{errors.email.message}</FormError>}
          </Form.Field>
          <Form.Field>
            <label htmlFor="password">
              Password
            </label>
            <FormPasswordWrapper
              show={showPassword}
              toggleClick={() => setShowPassword(!showPassword)}
            >
              <FormInput
                name="password"
                type={showPassword ? "text" : "password"}
                ref={register({
                  required: {
                    value: true,
                    message: "This field is required"
                  }
                })}
                autocomplete="off"
                error={errors.password}
              />
            </FormPasswordWrapper>
            {errors.password && <FormError>{errors.password.message}</FormError>}
            {serverError && <FormError>{serverError}</FormError>}
          </Form.Field>
          <Helper isAgree={isAgree} setIsAgree={setIsAgree} agreeError={agreeError} setAgreeError={setAgreeError} />
          <StyledButtonPrimary type="submit">Sign up</StyledButtonPrimary>
          {/* <StyledButton onClick={() => setWeb3Login(true)}>Sign up with web3 address</StyledButton> */}
        </Form>
      )}
      {web3Login && (
        <div>
          {hasExtension && (
            <div>
              <AccountSelector accounts={[]} />
              <Helper isAgree={isAgree} setIsAgree={setIsAgree} />
            </div>
          )}
          {!hasExtension && <DownloadPolkadot />}
          <StyledButtonPrimary>Sign up</StyledButtonPrimary>
          <StyledButton onClick={() => setWeb3Login(false)}>
            Sign up with username
          </StyledButton>
        </div>
      )}
      <StyledDivider />
      <LoginWrapper>
        Already have an account?
        <StyledLink to="/login">Login</StyledLink>
      </LoginWrapper>
    </CardWrapper>
  );
}

export default Register;

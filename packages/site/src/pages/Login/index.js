import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Redirect } from "react-router-dom";
import queryString from "query-string";
import { useForm } from "react-hook-form";
import styled, { css } from "styled-components";
import { Form } from "semantic-ui-react";

import {
  loggedInUserSelector,
  setLoggedInUser,
} from "../../store/reducers/userSlice";
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

import api from "../../services/scanApi";
import { signMessage } from "../../services/chainApi";
import { useIsMounted } from "../../utils/hooks";
import {
  isWeb3Injected,
  web3Accounts,
  web3Enable,
} from "@polkadot/extension-dapp";

const CardWrapper = styled(Card)`
  max-width: 424px;
  margin: auto;
  margin-top: 28px;
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
  .field:first-child {
    margin-bottom: 24px !important;
  }
  .field:nth-child(2) {
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
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
`;

const RememberMe = styled.div`
  display: flex;
  align-items: center;
  color: ${TEXT_DARK_MINOR};
  p {
    line-height: 24px;
  }
  cursor: pointer;
`;

const StyledTextMnor = styled(TextMinor)`
  text-decoration: underline;
`;

const CheckImage = styled(GrayImage)`
  margin-right: 8px;
  ${(p) =>
    p.checked &&
    css`
      -webkit-filter: grayscale(0);
      filter: grayscale(0);
      opacity: 1;
    `}
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

const SignUpWrapper = styled.div`
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

function Login({ location }) {
  const [web3Login, setWeb3Login] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [hasExtension, setHasExtension] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isRememberMe, setIsRememberMe] = useState(false);
  const loggedInUser = useSelector(loggedInUserSelector);
  const { register, handleSubmit, errors } = useForm();
  const dispatch = useDispatch();
  const [selectedAccount, setSelectedAccount] = useState(null);
  const isMounted = useIsMounted();

  useEffect(() => {
    if (web3Login) {
      (async () => {
        await web3Enable("doTreasury");
        if (!isWeb3Injected) {
          if (isMounted.current) {
            setHasExtension(false);
          }
          return;
        }
        const extensionAccounts = await web3Accounts();
        const accounts = extensionAccounts.map(
          ({ address, meta: { name } }) => {
            return {
              address,
              name,
            };
          }
        );

        if (isMounted.current) {
          setAccounts(accounts);
        }
      })();
    }
  }, [web3Login, isMounted]);

  // Redirect out of here if user has already logged in
  if (loggedInUser) {
    const q = queryString.parse(location.search);
    return <Redirect to={q.returnUrl || "/"} />;
  }

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

  // Do login
  const onSubmit = async (formData) => {
    const loginResult = await scanApi.login(
      formData.username,
      formData.password
    )
    if (loginResult) {
      saveLoggedInResult(loginResult);
    }
  };

  const doWeb3Login = async () => {
    const { result } = await api.fetch(
      `/auth/login/${selectedAccount.address}`
    );
    if (result?.challenge) {
      const signature = await signMessage(
        result?.challenge,
        selectedAccount.address
      );
      const { result: loginResult } = await api.fetch(
        `/auth/login/${result?.attemptId}`,
        {},
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ challengeAnswer: signature }),
        }
      );
      if (loginResult) {
        saveLoggedInResult(loginResult);
      }
    }
  };

  return (
    <CardWrapper>
      <Header>Login</Header>
      {!web3Login && (
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Field>
            <label htmlFor="username">
              Username
              {errors.username && (
                <span>
                  <span>*</span>
                </span>
              )}
            </label>
            <FormInput
              name="username"
              type="text"
              ref={register({ required: true })}
              error={errors.username}
            />
            {errors.username && <FormError>error message</FormError>}
          </Form.Field>
          <Form.Field>
            <label htmlFor="password">
              Password
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
          <HelperWrapper>
            <RememberMe onClick={() => setIsRememberMe(!isRememberMe)}>
              <CheckImage src="/imgs/circle-pass.svg" checked={isRememberMe} />
              <p>Remember me</p>
            </RememberMe>
            <Link to="?#">
              <StyledTextMnor>Forgot password?</StyledTextMnor>
            </Link>
          </HelperWrapper>
          <StyledButtonPrimary type="submit">Login</StyledButtonPrimary>
          <StyledButton onClick={() => setWeb3Login(true)}>
            Login with web3 address
          </StyledButton>
        </Form>
      )}
      {web3Login && (
        <div>
          {hasExtension && (
            <AccountSelector
              accounts={accounts}
              onSelect={(account) => setSelectedAccount(account)}
            />
          )}
          {!hasExtension && <DownloadPolkadot />}
          <StyledButtonPrimary onClick={doWeb3Login}>Login</StyledButtonPrimary>
          <StyledButton onClick={() => setWeb3Login(false)}>
            Login with username
          </StyledButton>
        </div>
      )}
      <StyledDivider />
      <SignUpWrapper>
        Don't have an account?
        <StyledLink to="/register">Sign up</StyledLink>
      </SignUpWrapper>
    </CardWrapper>
  );
}

export default Login;

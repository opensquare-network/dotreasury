import React from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Link, Redirect } from 'react-router-dom';
import queryString from 'query-string';
import { useForm } from 'react-hook-form';
import styled from "styled-components";
import { Button, Form } from "semantic-ui-react";

import { loggedInUserSelector, setLoggedInUser } from "../../store/reducers/userSlice";
import scanApi from "../../services/scanApi";
import Card from "../../components/Card";
import Text from "../../components/Text";
import { TEXT_DARK_MAJOR, PRIMARY_THEME_COLOR } from "../../constants";

const CardWrapper = styled(Card)`
  max-width: 450px;
  margin: auto;
  padding: 20px;
  .ui.form input:focus {
    border-color: ${PRIMARY_THEME_COLOR} !important;
  }
  label {
    color: ${TEXT_DARK_MAJOR} !important;
  }
`

const Header = styled(Text)`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 30px;
`

const StyledLink = styled(Link)`
  display: block;
  color: ${PRIMARY_THEME_COLOR};
  :hover {
    color: ${PRIMARY_THEME_COLOR};
  }
  margin-bottom: 20px;
`

function Login({ location }) {
  const loggedInUser = useSelector(loggedInUserSelector);
  const { register, handleSubmit, errors } = useForm();
  const dispatch = useDispatch();

  // Redirect out of here if user has already logged in
  if (loggedInUser) {
    const q = queryString.parse(location.search);
    return <Redirect to={q.returnUrl || '/'} />;
  }

  // Do login
  const onSubmit = async (formData) => {
    const loginResult = await scanApi.login(formData.username, formData.password);
    if (loginResult) {
      const loggedInUser = {
        username: loginResult.username,
        email: loginResult.email,
      };
      dispatch(setLoggedInUser(loggedInUser));

      localStorage.setItem("token", JSON.stringify({
        accessToken: loginResult.accessToken,
        refreshToken: loginResult.refreshToken,
      }));
    }
  };

  return (
    <CardWrapper>
      <Header>Login</Header>
      <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Field>
            <label htmlFor="username">Username
              { errors.username
                && <span>
                    <span>*</span>
                  </span>
              }
            </label>
            <input name="username" type="text" ref={register({required: true})} />
          </Form.Field>
          <Form.Field>
            <label htmlFor="password">Password
              { errors.password
                && <span>
                    <span>*</span>
                  </span>
              }
            </label>
            <input name="password" type="password" ref={register({required: true})} />
          </Form.Field>
        <StyledLink to="/register">Register new user</StyledLink>
        <Button primary type="submit">Login</Button>
      </Form>
    </CardWrapper>
  );
}

export default Login;

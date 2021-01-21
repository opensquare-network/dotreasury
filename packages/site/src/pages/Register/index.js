import React from 'react';
import { useDispatch } from "react-redux";
import { useForm } from 'react-hook-form';
import styled from "styled-components";
import { Button, Form } from "semantic-ui-react";

import { setLoggedInUser } from "../../store/reducers/userSlice";
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

function Register({ history }) {
  const { register, handleSubmit, errors } = useForm();
  const dispatch = useDispatch();

  // Do login
  const onSubmit = async (formData) => {
    const signupResult = await scanApi.signup(formData.username, formData.email, formData.password);
    dispatch(setLoggedInUser(signupResult));
    history.push('/login');
  };

  return (
    <CardWrapper>
      <Header>Register</Header>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Form.Field>
          <label htmlFor="username">Username
            { errors.username
              && <span className="text-danger">
                  <span>*</span>
                </span>
            }
          </label>
          <input name="username" type="text" ref={register({required: true})} />
        </Form.Field>
        <Form.Field>
          <label htmlFor="email">Email
            { errors.email
              && <span className="text-danger">
                  <span>*</span>
                </span>
            }
          </label>
          <input name="email" type="text" ref={register({required: true})} />
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
        <Button primary type="submit">Register</Button>
      </Form>
    </CardWrapper>
  );
}

export default Register;

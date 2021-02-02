import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { Form } from "semantic-ui-react";
import api from "../../services/scanApi";
import { useDispatch, useSelector } from "react-redux";

import {
  StyledItem,
  StyledTitle,
  EditWrapper,
  StyledText,
  EditButton,
  StyledFormInput,
  StyledFormInputWrapper,
} from "./components";
import FormError from "../../components/FormError";
import {
  loggedInUserSelector,
  setLoggedInUser,
} from "../../store/reducers/userSlice";
import { useIsMounted } from "../../utils/hooks";

const Email = ({ email }) => {
  const dispatch = useDispatch();
  const [isChange, setIsChange] = useState(false);
  const inputRef = useRef(null);
  const { register, handleSubmit, errors } = useForm();
  const [serverError, setServerError] = useState("");
  const loggedInUser = useSelector(loggedInUserSelector);
  const isMounted = useIsMounted();

  const onSubmit = async (formData) => {
    const { result, error } = await api.authFetch(
      `/user/changeemail`,
      {},
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password: formData.password,
          newEmail: formData.email,
        }),
      }
    );

    if (result) {
      if (isMounted.current) {
        setServerError("");
        setIsChange(false);
      }

      dispatch(
        setLoggedInUser({
          username: loggedInUser.username,
          email: formData.email,
        })
      );
    }

    if (error) {
      if (isMounted.current) {
        setServerError(error.message);
      }
    }
  };

  useEffect(() => {
    isChange && inputRef?.current?.focus();
  }, [isChange]);

  return (
    <StyledItem>
      <StyledTitle>Email</StyledTitle>
      {!isChange && (
        <div>
          <EditWrapper>
            <StyledText>{email}</StyledText>
            <EditButton
              onClick={() => {
                setIsChange(true);
              }}
            >
              Edit
            </EditButton>
          </EditWrapper>
        </div>
      )}
      {isChange && (
        <>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Field>
              <EditWrapper>
                <StyledFormInputWrapper>
                  <StyledFormInput
                    name="email"
                    type="text"
                    placeholder="Email"
                    defaultValue={email}
                    ref={e => {
                      inputRef.current = e
                      register(e, {
                        required: {
                          value: true,
                          message: "This field is required"
                        }
                      })
                    }}
                    error={errors.email}
                  />
                  {errors.email && <FormError>{errors.email.message}</FormError>}
                </StyledFormInputWrapper>
              </EditWrapper>
              <EditWrapper>
                <StyledFormInputWrapper>
                  <StyledFormInput
                    name="password"
                    type="password"
                    placeholder="Please fill password"
                    ref={register({
                      required: {
                        value: true,
                        message: "This field is required"
                      }
                    })}
                    error={errors.password}
                  />
                  {errors.password && <FormError>{errors.password.message}</FormError>}
                </StyledFormInputWrapper>
                <EditButton type="submit">Change</EditButton>
              </EditWrapper>
            </Form.Field>
          </Form>
          {serverError && <FormError>{serverError}</FormError>}
        </>
      )}
    </StyledItem>
  );
};

export default Email;

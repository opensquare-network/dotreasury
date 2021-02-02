import React, { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { Form } from "semantic-ui-react";
import api from "../../services/scanApi";

import {
  StyledItem,
  StyledTitle,
  EditWrapper,
  EditButton,
  StyledFormInput,
  StyledFormInputWrapper
} from "./components";
import FormError from "../../components/FormError";
import { useIsMounted } from "../../utils/hooks";

const Password = () => {
  const { register, handleSubmit, errors } = useForm();
  const [serverError, setServerError] = useState("");
  const isMounted = useIsMounted();
  const currentPasswordRef = useRef(null);
  const newPasswordRef = useRef(null);

  const onSubmit = async (formData) => {
    const { result, error } = await api.authFetch(
      `/user/changepassword`,
      {},
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          oldPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        }),
      }
    );

    if (result) {
      if (isMounted.current) {
        setServerError("");
        if (currentPasswordRef && currentPasswordRef.current) {
          currentPasswordRef.current.value = "";
        }
        if (newPasswordRef && newPasswordRef.current) {
          newPasswordRef.current.value = "";
        }
      }
    }

    if (error) {
      if (isMounted.current) {
        setServerError(error.message);
      }
    }
  };

  return (
    <StyledItem>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Form.Field>
          <StyledTitle>Current password</StyledTitle>
          <EditWrapper>
            <StyledFormInputWrapper>
              <StyledFormInput
                name="currentPassword"
                type="password"
                placeholder="Please fill current password"
                ref={e => {
                  currentPasswordRef.current = e
                  register(e, {
                    required: {
                      value: true,
                      message: "This field is required"
                    }
                  })
                }}
                error={errors.currentPassword}
              />
              {errors.currentPassword && <FormError>{errors.currentPassword.message}</FormError>}
            </StyledFormInputWrapper>
          </EditWrapper>
          <StyledTitle>New password</StyledTitle>
          <EditWrapper>
            <StyledFormInputWrapper>
              <StyledFormInput
                name="newPassword"
                type="password"
                placeholder="Please fill new password"
                ref={e => {
                  newPasswordRef.current = e
                  register(e, {
                    required: {
                      value: true,
                      message: "This field is required"
                    }
                  })
                }}
                error={errors.newPassword}
              />
              {errors.newPassword && <FormError>{errors.newPassword.message}</FormError>}
            </StyledFormInputWrapper>
            <EditButton type="submit">Change</EditButton>
          </EditWrapper>
        </Form.Field>
      </Form>
      {serverError && <FormError>{serverError}</FormError>}
    </StyledItem>
  );
};

export default Password;

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Form } from "semantic-ui-react";
import api from "../../services/scanApi";

import { StyledItem, StyledTitle, EditWrapper, EditButton, StyledFormInput } from "./components";
import FormError from "../../components/FormError";

const Password = () => {
  const { register, handleSubmit } = useForm();
  const [serverError, setServerError] = useState("");

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
      setServerError("");
    }

    if (error) {
      setServerError(error.message);
    }
  };

  return (
    <StyledItem>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Form.Field>
          <StyledTitle>
            Current password
          </StyledTitle>
          <EditWrapper>
            <StyledFormInput
              name="currentPassword"
              type="password"
              placeholder="Please fill current password"
              ref={register({
                required: true
              })}
            />
          </EditWrapper>
          <StyledTitle>
            New password
          </StyledTitle>
          <EditWrapper>
            <StyledFormInput
              name="newPassword"
              type="password"
              placeholder="Please fill new password"
              ref={register({
                required: true
              })}
            />
            <EditButton type="submit">Change</EditButton>
          </EditWrapper>
        </Form.Field>
      </Form>
      {serverError && <FormError>{serverError}</FormError>}
    </StyledItem>
  )
}

export default Password;

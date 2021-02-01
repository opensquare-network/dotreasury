import React from "react";
import { useForm } from "react-hook-form";
import { Form } from "semantic-ui-react";

import { StyledItem, StyledTitle, EditWrapper, EditButton, StyledFormInput } from "./components";

const Password = () => {
  const { register, handleSubmit } = useForm();

  const onSubmit = async (formData) => {
    console.log(formData);
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
              ref={register({
                required: true
              })}
            />
            <EditButton type="submit">Change</EditButton>
          </EditWrapper>
        </Form.Field>
      </Form>
    </StyledItem>
  )
}

export default Password;

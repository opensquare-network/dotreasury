import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { Form } from "semantic-ui-react";
import api from "../../services/scanApi";

import { StyledItem, StyledTitle, EditWrapper, StyledText, EditButton, StyledFormInput } from "./components";
import FormError from "../../components/FormError";

const Email = ({ email }) => {
  const [isChange, setIsChange] = useState(false);
  const inputRef = useRef(null);
  const { register, handleSubmit } = useForm();
  const [serverError, setServerError] = useState("");

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
      setServerError("");
      setIsChange(false);
    }

    if (error) {
      setServerError(error.message);
    }
  };

  useEffect(() => {
    isChange && inputRef?.current?.focus();
  }, [isChange])

  return (
    <StyledItem>
      <StyledTitle>
        Email
      </StyledTitle>
      {!isChange && <div>
        <EditWrapper>
          <StyledText>{email}</StyledText>
          <EditButton onClick={() => {
            setIsChange(true);
          }}>Edit</EditButton>
        </EditWrapper>
      </div>}
      {isChange && (
        <>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Field>
              <EditWrapper>
                <StyledFormInput
                  name="email"
                  type="text"
                  defaultValue={email}
                  ref={register({
                    required: true
                  })}
                />
              </EditWrapper>
              <EditWrapper>
                <StyledFormInput
                  name="password"
                  type="password"
                  ref={register({
                    required: true
                  })}
                />
                <EditButton type="submit">Change</EditButton>
              </EditWrapper>
            </Form.Field>
          </Form>
          {serverError && <FormError>{serverError}</FormError>}
        </>
      )}
    </StyledItem>
  )
}

export default Email;

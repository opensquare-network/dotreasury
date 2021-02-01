import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { Form } from "semantic-ui-react";

import { StyledItem, StyledTitle, EditWrapper, StyledText, EditButton, StyledFormInput } from "./components";

const Email = ({ email }) => {
  const [isChange, setIsChange] = useState(false);
  const inputRef = useRef(null);
  const { register, handleSubmit } = useForm();

  const onSubmit = async (formData) => {
    console.log(formData);
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
      {isChange && <Form onSubmit={handleSubmit(onSubmit)}>
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
      </Form>}
    </StyledItem>
  )
}

export default Email;

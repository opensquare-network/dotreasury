import React, { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux"
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
import { addToast } from "../../store/reducers/toastSlice";

const Password = () => {
  const { register, handleSubmit, errors } = useForm();
  const isMounted = useIsMounted();
  const oldPasswordRef = useRef(null);
  const newPasswordRef = useRef(null);
  const dispatch = useDispatch();
  const [serverErrors, setServerErrors] = useState(null);
  const [showErrors, setShowErrors] = useState(null);

  useEffect(() => {
    setShowErrors({
      oldPassword: errors?.oldPassword?.message
        || serverErrors?.data?.oldPassword?.[0]
        || null,
        newPassword: errors?.newPassword?.message
        || serverErrors?.data?.newPassword?.[0]
        || null,
      message: serverErrors?.message || null
    });
  }, [errors, serverErrors]);

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
          oldPassword: formData.oldPassword,
          newPassword: formData.newPassword,
        }),
      }
    );

    if (result) {
      if (isMounted.current) {
        if (oldPasswordRef && oldPasswordRef.current) {
          oldPasswordRef.current.value = "";
        }
        if (newPasswordRef && newPasswordRef.current) {
          newPasswordRef.current.value = "";
        }
        dispatch(addToast({
          type: "success",
          message: "Change password sucess"
        }))
      }
    }

    if (error) {
      if (isMounted.current) {
        setServerErrors(error);
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
                name="oldPassword"
                type="password"
                placeholder="Please fill current password"
                ref={e => {
                  oldPasswordRef.current = e
                  register(e, {
                    required: {
                      value: true,
                      message: "This field is required"
                    }
                  })
                }}
                error={showErrors?.oldPassword}
                onChange={() => {
                  setShowErrors(null)
                }}
              />
              {showErrors?.oldPassword && <FormError>{showErrors.oldPassword}</FormError>}
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
                error={showErrors?.newPassword}
                onChange={() => {
                  setShowErrors(null)
                }}
              />
              {showErrors?.newPassword && <FormError>{showErrors.newPassword}</FormError>}
            </StyledFormInputWrapper>
            <EditButton type="submit" onClick={() => setServerErrors(null)}>Change</EditButton>
          </EditWrapper>
        </Form.Field>
      </Form>
      {!showErrors?.oldPassword &&
        !showErrors?.newPassword &&
        showErrors?.message && <FormError>{showErrors.message}</FormError>}
    </StyledItem>
  );
};

export default Password;

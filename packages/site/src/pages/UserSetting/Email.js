import React, { useEffect, useState } from "react";
import api from "../../services/scanApi";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { Image } from "semantic-ui-react";

import { StyledItem, StyledTitle, EditWrapper, EditButton } from "./components";
import FormError from "../../components/FormError";
import TextMinor from "../../components/TextMinor";
import TextDisable from "../../components/TextDisable";
import { useIsMounted } from "../../utils/hooks";
import {
  userProfileSelector,
  fetchUserProfile,
  verifyEmailSendTimeSelector,
  setVerifyEmailSendTime,
} from "../../store/reducers/userSlice";

const EmailField = styled.div`
  padding: 8px 16px;
  background: #fbfbfb;
  border-radius: 4px;
  flex-grow: 1;
  max-width: calc(100% - 92px);
  overflow: hidden;
  text-overflow: ellipsis;
`;

const EmailInfo = styled.div`
  display: flex;
  justify-content: space-between;
`;

const VerifiedInfo = styled.div`
  display: flex;
  align-items: center;
  & > :first-child {
    margin-right: 6px;
  }
`;

const Email = () => {
  const dispatch = useDispatch();
  const [serverError, setServerError] = useState("");
  const isMounted = useIsMounted();
  const [timeNow, setTimeNow] = useState(Date.now());

  const userProfile = useSelector(userProfileSelector);
  const verifyEmailSendTime = useSelector(verifyEmailSendTimeSelector);
  const { email, emailVerified } = userProfile ?? {};

  const sendVerifyEmail = async () => {
    const { result, error } = await api.authFetch(
      `/user/resendverifyemail`,
      {},
      {
        method: "POST",
      }
    );

    if (result) {
      dispatch(fetchUserProfile());
      dispatch(setVerifyEmailSendTime(Date.now()));
      setTimeNow(Date.now());
    }

    if (error) {
      if (isMounted.current) {
        setServerError(error.message);
      }
    }
  };

  const waitSeconds = parseInt(
    Math.max(0, verifyEmailSendTime + 60 * 1000 - timeNow) / 1000
  );
  useEffect(() => {
    if (emailVerified) {
      if (isMounted.current) {
        setServerError("");
      }
      return;
    }

    if (isMounted.current) {
      if (waitSeconds > 0) {
        setServerError(
          "Verification email has been sent out, please check your mailbox."
        );
      } else {
        setServerError("");
      }
    }

    const updateNow = () => {
      if (isMounted.current) {
        setTimeNow(Date.now());
      }
    };
    setTimeout(updateNow, 1000);
    // Avoid the settimeout chain interruption.
    setTimeout(updateNow, 2000);

    if (waitSeconds === 0 || waitSeconds % 5 === 0) {
      dispatch(fetchUserProfile());
    }
  }, [dispatch, waitSeconds, emailVerified, isMounted]);

  return (
    <StyledItem>
      <StyledTitle>Email</StyledTitle>
      <EditWrapper>
        <EmailField>
          <EmailInfo>
            <TextMinor>{email}</TextMinor>
            <VerifiedInfo>
              <Image
                src={emailVerified ? "/imgs/good.svg" : "/imgs/warning.svg"}
              />
              <TextDisable>
                {emailVerified ? "Verified" : "Unverified"}
              </TextDisable>
            </VerifiedInfo>
          </EmailInfo>
        </EmailField>
        {!emailVerified && (
          <EditButton disabled={waitSeconds > 0} onClick={sendVerifyEmail}>
            {waitSeconds > 0 ? `${waitSeconds}s` : "Resend"}
          </EditButton>
        )}
      </EditWrapper>
      {serverError && <FormError>{serverError}</FormError>}
    </StyledItem>
  );
};

export default Email;

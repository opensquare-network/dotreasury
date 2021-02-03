import React, { useEffect, useState } from "react";
import api from "../../services/scanApi";
import { useDispatch, useSelector } from "react-redux";

import {
  StyledItem,
  StyledTitle,
  EditWrapper,
  StyledText,
  EditButton,
} from "./components";
import FormError from "../../components/FormError";
import { useIsMounted } from "../../utils/hooks";
import {
  userProfileSelector,
  fetchUserProfile,
  verifyEmailSendTimeSelector,
  setVerifyEmailSendTime,
} from "../../store/reducers/userSlice";

const Email = () => {
  const dispatch = useDispatch();
  const [serverError, setServerError] = useState("");
  const isMounted = useIsMounted();
  const [timeNow, setTimeNow] = useState(Date.now());

  const userProfile = useSelector(userProfileSelector);
  const verifyEmailSendTime = useSelector(verifyEmailSendTimeSelector);
  const { email, emailVerified } = userProfile;

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

  const waitSeconds = parseInt(Math.max(0, verifyEmailSendTime + 60 * 1000 - timeNow)  / 1000);
  useEffect(() => {
    if (emailVerified) {
      if (isMounted.current) {
        setServerError("");
      }
      return;
    }

    if (isMounted.current) {
      if (waitSeconds > 0) {
        setServerError("Verification email has been sent out, please check your mailbox.");
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
        <StyledText>{email}</StyledText>
        {
          !emailVerified && (
            <EditButton
              disabled={ waitSeconds > 0 }
              onClick={sendVerifyEmail}
            >
              { waitSeconds > 0 ? `${waitSeconds}s` : "Verify" }
            </EditButton>
          )
        }
      </EditWrapper>
      {serverError && <FormError>{serverError}</FormError>}
    </StyledItem>
  );
};

export default Email;

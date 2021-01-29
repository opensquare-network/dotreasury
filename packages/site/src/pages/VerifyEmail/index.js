import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Redirect } from "react-router-dom";
import queryString from "query-string";

import scanApi from "../../services/scanApi";
import Card from "../../components/Card";
import Text from "../../components/Text";
import { PRIMARY_THEME_COLOR, TEXT_DARK_MAJOR } from "../../constants";
import ButtonPrimary from "../../components/ButtonPrimary";
import { useIsMounted } from "../../utils/hooks";
import TextMinor from "../../components/TextMinor";
import Divider from "../../components/Divider";

const CardWrapper = styled(Card)`
  max-width: 424px;
  margin: 28px auto auto;
  padding: 32px;
  .ui.form input:focus {
    border-color: ${PRIMARY_THEME_COLOR} !important;
  }
  label {
    color: ${TEXT_DARK_MAJOR} !important;
    font-weight: 500 !important;
    line-height: 24px !important;
    margin-bottom: 8px !important;
  }
  .field:not(:last-child) {
    margin-bottom: 24px !important;
  }
  .field:nth-child(3) {
    margin-bottom: 8px !important;
  }
  @media screen and (max-width: 408px) {
    padding: 32px 16px;
  }
`;

const Header = styled(Text)`
  font-family: "Montserrat", serif;
  font-size: 28px;
  font-weight: bold;
  line-height: 44px;
  margin-bottom: 24px;
  text-align: center;
`;

const StyledButtonPrimary = styled(ButtonPrimary)`
  width: 100%;
  margin-bottom: 16px !important;
`;

const TextWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 20px;
  background: rgba(251, 251, 251, 1);
  margin-bottom: 24px;
`;

const StyledDivider = styled(Divider)`
  margin: 0 !important;
`;

const TimeText = styled(TextMinor)`
  margin-left: 8px;
  color: #f00;
`;

function VerifyEmail({ history, location }) {
  const isMounted = useIsMounted();
  const [verified, setVerified] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const [errorMsg, setErrorMsg] = useState("");

  const q = queryString.parse(location.search);
  const { email, token } = q;

  useEffect(() => {
    if (email && token) {
      // Verify email
      const doVerify = async (email, token) => {
        const { result, error } = await scanApi.fetch(
          "/auth/verify",
          {},
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, token }),
          }
        );

        if (result) {
          if (isMounted.current) {
            setVerified(true);
          }
        }
        if (error) {
          if (isMounted.current) {
            setErrorMsg(error.message);
          }
        }
      };

      doVerify(email, token);
    } else {
      setErrorMsg("Email or token is missing.");
    }
  }, [email, token, isMounted]);

  if (verified) {
    if (countdown !== 0) {
      setTimeout(() => {
        if (isMounted.current) {
          setCountdown(countdown - 1);
        }
      }, 1000);
    }
  }

  return (
    <CardWrapper>
      <Header>
        {verified ? "Congrats" : errorMsg ? "Verify email" : "Verifying email"}
      </Header>
      <TextWrapper>
        <TextMinor>
          {verified
            ? "You email has been successfully verified."
            : errorMsg || "Please wait..."}
        </TextMinor>
      </TextWrapper>
      <StyledButtonPrimary
        disabled={!verified && !errorMsg}
        onClick={() => {
          history.push("/");
        }}
      >
        Got it
      </StyledButtonPrimary>
      {verified && (
        <>
          <StyledDivider />
          <TextWrapper>
            The page will be re-directed in
            <TimeText>{countdown}s</TimeText>
          </TextWrapper>
          {countdown === 0 && <Redirect to="/" />}
        </>
      )}
    </CardWrapper>
  );
}

export default VerifyEmail;

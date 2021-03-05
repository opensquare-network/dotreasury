import React, { useState, useEffect } from "react";
import styled from "styled-components";

import Card from "../../components/Card";
import Markdown from "../../components/Markdown";
import privacyMd from "./privacy.md"

const Wrapper = styled(Card)`
  padding: 2rem !important;
`

const UserAgreement = () => {
  const [markdown, setMarkdown] = useState("");

  useEffect(() => {
    fetch(privacyMd).then(response => response.text()).then(text => {
      setMarkdown(text)
    })
  }, []);

  return (
    <Wrapper>
      <Markdown md={markdown} minor />
    </Wrapper>
  )
}

export default UserAgreement;

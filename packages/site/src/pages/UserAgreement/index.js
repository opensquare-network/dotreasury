import React, { useState, useEffect } from "react";
import styled from "styled-components";

import Card from "../../components/Card";
import Markdown from "../../components/Markdown";
import testMd from "./user-agreement.md"

const Wrapper = styled(Card)`
  padding: 2rem !important;
`

const UserAgreement = () => {
  const [markdown, setMarkdown] = useState("");

  useEffect(() => {
    fetch(testMd).then(response => response.text()).then(text => {
      setMarkdown(text)
    })
  })

  return (
    <Wrapper>
      <Markdown md={markdown} />
    </Wrapper>
  )
}

export default UserAgreement;

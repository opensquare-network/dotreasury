import React from "react";
import styled from "styled-components";
import { Segment, Dimmer, Image } from "semantic-ui-react";

const Wrapper = styled.div`
  .ui.segment {
    padding: 0;
    border: 0;
    width: fit-content;
    min-width: 100%;
  }
`

const LoadingTable = ({children, loading}) => {
  return (
    <Wrapper>
      <Segment>
        <Dimmer active={loading} inverted>
          <Image src="/imgs/loading.svg" />
        </Dimmer>
        {children}
      </Segment>
    </Wrapper>
  )
}

export default LoadingTable;

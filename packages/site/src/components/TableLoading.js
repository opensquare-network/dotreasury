import React from "react";
import styled from "styled-components";
import { Segment, Dimmer, Image } from "semantic-ui-react";

const Wrapper = styled.div`
  .ui.segment {
    padding: 0;
    border: 0;
    width: fit-content;
    min-width: 100%;
    background: transparent !important;
    border: 0 !important;
    box-shadow: none !important;
  }
`

const StyledSegment = styled(Segment)`
  border-radius: 8px !important;
`

const LoadingTable = ({children, loading}) => {
  return (
    <Wrapper>
      <StyledSegment>
        <Dimmer active={loading} inverted>
          <Image src="/imgs/loading.svg" />
        </Dimmer>
        {children}
      </StyledSegment>
    </Wrapper>
  )
}

export default LoadingTable;

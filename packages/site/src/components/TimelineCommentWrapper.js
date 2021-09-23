import styled from "styled-components";

const TimelineCommentWrapper = styled.div`
  margin-top: 24px;
  display: grid;
  gap: 24px;
  min-height: 0;
  @media screen and (min-width: 1128px) {
    grid-template-columns: repeat(3, 1fr);
    & > div:first-child {
      grid-column: 1 / 2;
    }
    & > div:last-child {
      grid-column: 2 / 4;
      > :not(:first-child) {
        margin-top: 24px;
      }
    }
  }
`;

export default TimelineCommentWrapper;

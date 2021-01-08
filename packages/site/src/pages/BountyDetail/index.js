import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import styled from "styled-components";
import { Divider, Image } from "semantic-ui-react";
import { useHistory } from "react-router-dom";
import {
  fetchBountyDetail,
  bountyDetailSelector,
  loadingBountyDetailSelector,
} from "../../store/reducers/bountySlice";

import InformationTable from "./InformationTable";
import Timeline from "../Timeline";
import Comment from "../Comment";
import RelatedLinks from "../RelatedLinks";
import Title from "../../components/Title";
import BountyLifeCycleTable from "./BountyLifeCycleTable";

const HeaderWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
  div:first-child {
    cursor: pointer;
  }
`;

const TableWrapper = styled.div`
  display: grid;
  gap: 16px;
  @media screen and (min-width: 556px) {
    grid-template-columns: repeat(auto-fit, minmax(556px, 1fr));
  }
  @media screen and (max-width: 556px) {
    grid-template-columns: repeat(1fr);
  }
`;

const TimelineCommentWrapper = styled.div`
  margin-top: 20px;
  display: grid;
  gap: 24px;
  @media screen and (min-width: 1128px) {
    grid-template-columns: repeat(3, 1fr);
    & > div:first-child {
      grid-column: 1 / 2;
    }
    & > div:last-child {
      grid-column: 2 / 4;
    }
  }
`;

function processTimeline(bountyDetail) {
  return [];
}

const BountyDetail = () => {
  const history = useHistory();
  const { bountyIndex } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchBountyDetail(bountyIndex));
  }, [dispatch, bountyIndex]);

  const loadingBountyDetail = useSelector(loadingBountyDetailSelector);
  const bountyDetail = useSelector(bountyDetailSelector);

  return (
    <>
      <HeaderWrapper>
        <div onClick={() => history.goBack()}>
          <Image src="/imgs/left-arrow.svg" width={"32px"} height={"32px"} />
        </div>
        <Title>Detail</Title>
      </HeaderWrapper>
      <TableWrapper>
        <InformationTable loading={loadingBountyDetail} />
        <BountyLifeCycleTable loading={loadingBountyDetail} />
      </TableWrapper>
      <RelatedLinks />
      <Divider />
      <TimelineCommentWrapper>
        <Timeline
          data={processTimeline(bountyDetail)}
          loading={loadingBountyDetail}
        />
        <Comment />
      </TimelineCommentWrapper>
    </>
  );
};

export default BountyDetail;

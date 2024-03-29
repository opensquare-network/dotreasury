import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import {
  loadingBountyDetailSelector,
  fetchChildBountyDetail,
  childBountyDetailSelector,
  setChildBountyDetail,
} from "../../../store/reducers/bountySlice";

import Timeline from "../../Timeline";
import Comment from "../../Comment";
import BountyLifeCycleTable from "./BountyLifeCycleTable";
import TimelineCommentWrapper from "../../../components/TimelineCommentWrapper";
import DetailTableWrapper from "../../../components/DetailTableWrapper";

import {
  chainSymbolSelector,
  scanHeightSelector,
} from "../../../store/reducers/chainSlice";
import DetailGoBack from "../../components/DetailGoBack";
import ChildInformationTable from "./ChildInformationTable";
import { processTimeline } from "../index";
import ClaimButton from "./ClaimButton";
import { Flex } from "../../../components/styled";
import useWaitSyncBlock from "../../../utils/useWaitSyncBlock";

const ChildBountyDetail = () => {
  const { bountyIndex } = useParams();
  const dispatch = useDispatch();
  const [timelineData, setTimelineData] = useState([]);

  const symbol = useSelector(chainSymbolSelector);

  useEffect(() => {
    dispatch(fetchChildBountyDetail(bountyIndex));
    return () => {
      dispatch(setChildBountyDetail({}));
    };
  }, [dispatch, bountyIndex]);

  const loadingBountyDetail = useSelector(loadingBountyDetailSelector);
  const bountyDetail = useSelector(childBountyDetailSelector);
  const scanHeight = useSelector(scanHeightSelector);

  const refreshData = useCallback(() => {
    dispatch(fetchChildBountyDetail(bountyDetail?.index));
  }, [dispatch, bountyDetail]);

  const waitScanAndUpdate = useWaitSyncBlock("Rewards claimed", refreshData);

  useEffect(() => {
    setTimelineData(processTimeline(bountyDetail, scanHeight, symbol));
  }, [bountyDetail, scanHeight, symbol]);

  const buttons = (
    <Flex>
      <ClaimButton childBounty={bountyDetail} onFinalized={waitScanAndUpdate} />
    </Flex>
  );

  return (
    <>
      <DetailGoBack />
      <DetailTableWrapper
        title="Child bounty"
        desc={`#${bountyIndex}`}
        buttons={buttons}
      >
        <ChildInformationTable loading={loadingBountyDetail} />
        <BountyLifeCycleTable loading={loadingBountyDetail} />
      </DetailTableWrapper>
      <TimelineCommentWrapper>
        <Timeline data={timelineData} loading={loadingBountyDetail} />
        <Comment type="child-bounty" index={parseInt(bountyIndex)} />
      </TimelineCommentWrapper>
    </>
  );
};

export default ChildBountyDetail;

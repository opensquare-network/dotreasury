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
  chainSelector,
  chainSymbolSelector,
  scanHeightSelector,
} from "../../../store/reducers/chainSlice";
import DetailGoBack from "../../components/DetailGoBack";
import { useChainRoute, useIsMounted } from "../../../utils/hooks";
import ChildInformationTable from "./ChildInformationTable";
import { processTimeline } from "../index";
import ClaimButton from "./ClaimButton";
import { newPendingToast, newToastId, removeToast } from "../../../store/reducers/toastSlice";
import { sleep } from "../../../utils";
import api from "../../../services/scanApi";

const ChildBountyDetail = () => {
  useChainRoute();

  const { bountyIndex } = useParams();
  const dispatch = useDispatch();
  const [timelineData, setTimelineData] = useState([]);
  const toastId = newToastId();
  const isMounted = useIsMounted();

  const symbol = useSelector(chainSymbolSelector);
  const chain = useSelector(chainSelector);

  useEffect(() => {
    dispatch(fetchChildBountyDetail(chain, bountyIndex));
    return () => {
      dispatch(fetchChildBountyDetail({}));
    };
  }, [dispatch, chain, bountyIndex]);

  const loadingBountyDetail = useSelector(loadingBountyDetailSelector);
  const bountyDetail = useSelector(childBountyDetailSelector);
  const scanHeight = useSelector(scanHeightSelector);

  useEffect(() => {
    setTimelineData(processTimeline(bountyDetail, scanHeight, symbol));
  }, [bountyDetail, scanHeight, symbol]);

  const onClaimInBlock = useCallback(() => {
    dispatch(newPendingToast(toastId, "Waiting to sync on-chain data..."));
  }, [dispatch, toastId]);

  const updateDetailForState = useCallback(
    async (endState) => {
      let times = 6;

      try {
        while (times-- > 0) {
          if (!isMounted.current) {
            return;
          }

          await sleep(10000);

          const { result } = await api.fetch(`/${chain}/child-bounties/${bountyDetail.index}`);

          if (result?.state?.state === endState) {
            if (isMounted.current) {
              dispatch(setChildBountyDetail(result));
            }
            return;
          }
        }
      } finally {
        dispatch(removeToast(toastId));
      }
    },
    [dispatch, toastId, bountyDetail, isMounted, chain]
  );

  const buttons = (
    <div style={{ display: "flex" }}>
      <ClaimButton
        beneficiary={bountyDetail?.beneficiary}
        parentBountyId={bountyDetail?.parentBountyId}
        index={bountyDetail?.index}
        onInBlock={onClaimInBlock}
        onFinalized={() => updateDetailForState("Claimed")}
      />
    </div>
  );

  return (
    <>
      <DetailGoBack />
      <DetailTableWrapper title="Child bounty" desc={`#${bountyIndex}`} buttons={buttons}>
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

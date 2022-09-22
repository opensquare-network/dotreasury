import React, { useCallback, useEffect, useRef, useState } from "react";
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
import { useChainRoute } from "../../../utils/hooks";
import ChildInformationTable from "./ChildInformationTable";
import { processTimeline } from "../index";
import ClaimButton from "./ClaimButton";
import { newPendingToast, newSuccessToast, newToastId, removeToast } from "../../../store/reducers/toastSlice";
import { sleep } from "../../../utils";
import useApi from "../../../hooks/useApi";
import { getBlockHeightFromHash } from "../../../services/chainApi";
import { Flex } from "../../../components/styled";

const ChildBountyDetail = () => {
  useChainRoute();

  const { bountyIndex } = useParams();
  const dispatch = useDispatch();
  const [timelineData, setTimelineData] = useState([]);
  const api = useApi();

  const symbol = useSelector(chainSymbolSelector);
  const chain = useSelector(chainSelector);

  useEffect(() => {
    dispatch(fetchChildBountyDetail(chain, bountyIndex));
    return () => {
      dispatch(setChildBountyDetail({}));
    };
  }, [dispatch, chain, bountyIndex]);

  const loadingBountyDetail = useSelector(loadingBountyDetailSelector);
  const bountyDetail = useSelector(childBountyDetailSelector);
  const scanHeight = useSelector(scanHeightSelector);

  const refScanHeight = useRef();
  useEffect(() => {
    refScanHeight.current = scanHeight;
  }, [scanHeight]);

  useEffect(() => {
    setTimelineData(processTimeline(bountyDetail, scanHeight, symbol));
  }, [bountyDetail, scanHeight, symbol]);

  const waitScanAndUpdate = useCallback(
    async (blockHash) => {
      dispatch(newSuccessToast("Rewards claimed", 1000));

      if (!api) {
        return;
      }

      const toastId = newToastId();
      setTimeout(async () => {
        dispatch(newPendingToast(toastId, "Waiting to sync on-chain data..."));
        try {
          const targetHeight = await getBlockHeightFromHash(api, blockHash);

          let times = 6;
          while (times-- > 0) {
            await sleep(10000);
            if (refScanHeight.current >= targetHeight) {
              break;
            }
          }

          dispatch(fetchChildBountyDetail(chain, bountyDetail?.index));
        } catch (e) {
          // ignore
        } finally {
          dispatch(removeToast(toastId));
        }
      }, 1000);
    },
    [api, refScanHeight, dispatch, bountyDetail, chain]
  );

  const buttons = (
    <Flex>
      <ClaimButton
        childBounty={bountyDetail}
        onFinalized={waitScanAndUpdate}
      />
    </Flex>
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

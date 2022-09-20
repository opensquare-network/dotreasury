import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import {
  loadingBountyDetailSelector,
  fetchChildBountyDetail,
  childBountyDetailSelector,
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
      dispatch(fetchChildBountyDetail({}));
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

  const waitAndUpdate = useCallback(
    async (blockHash) => {
      dispatch(newSuccessToast("Rewards claimed"));

      const toastId = newToastId();
      dispatch(newPendingToast(toastId, "Waiting to sync on-chain data..."));

      const block = await api.rpc.chain.getBlock(blockHash);
      const targetHeight = block.block.header.number.toNumber();

      try {
        let times = 6;
        while (true) {
          times--;
          if (times === 0) {
            return;
          }
          await sleep(10000);
          if (refScanHeight.current >= targetHeight) {
            break;
          }
        }

        dispatch(fetchChildBountyDetail(chain, bountyDetail?.index));
      } finally {
        dispatch(removeToast(toastId));
      }
    },
    [api, refScanHeight, dispatch, bountyDetail, chain]
  );

  const buttons = (
    <div style={{ display: "flex" }}>
      <ClaimButton
        beneficiary={bountyDetail?.beneficiary}
        parentBountyId={bountyDetail?.parentBountyId}
        index={bountyDetail?.index}
        onFinalized={(blockHash) => waitAndUpdate(blockHash)}
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

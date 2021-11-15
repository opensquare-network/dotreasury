import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import {
  setTipDetail,
  fetchTipCountdown,
  fetchTipDetail,
  loadingTipDetailSelector,
  tipDetailSelector,
} from "../../store/reducers/tipSlice";
import { linksSelector, TipIndex } from "../../store/reducers/linkSlice";
import { chainSelector } from "../../store/reducers/chainSlice";

import InformationTable from "./InformationTable";
import Timeline from "../Timeline";
import Comment from "../Comment";
import RelatedLinks from "../RelatedLinks";
import User from "../../components/User";
import Balance from "../../components/Balance";
import TipLifeCycleTable from "./TipLifeCycleTable";
import Funder from "./Funder";
import ClickableLink from "../../components/ClickableLink";
import TimelineCommentWrapper from "../../components/TimelineCommentWrapper";
import DetailGoBack from "../components/DetailGoBack";
import { useChainRoute } from "../../utils/hooks";
import DetailTableWrapper from "../../components/DetailTableWrapper";

function processTimeline(tipDetail, links) {
  return (tipDetail.timeline || []).map((timelineItem) => {
    let fields = [];

    if (timelineItem.method === "reportAwesome") {
      const { reason, beneficiary, finder } = timelineItem.args;
      // const reasonText = hexToString(reason);
      fields = [
        {
          title: "Finder",
          value: <User address={finder} />,
        },
        {
          title: "Beneficiary",
          value: <User address={beneficiary} />,
        },
        {
          title: "Reason",
          value: <ClickableLink links={links}>{reason}</ClickableLink>,
        },
      ];
    } else if (timelineItem.method === "tipNew") {
      const {
        tip_value: tipValue,
        beneficiary,
        reason: reasonText,
        finder,
      } = timelineItem.args;
      fields = [
        {
          title: "Funder",
          value: <User address={finder} />,
        },
        {
          title: "Beneficiary",
          value: <User address={beneficiary} />,
        },
        {
          title: "Tip value",
          value: (
            <Balance value={tipValue} usdt={tipDetail.symbolPrice} horizontal />
          ),
        },
        {
          title: "Reason",
          value: <ClickableLink links={links}>{reasonText}</ClickableLink>,
        },
      ];
    } else if (timelineItem.method === "tip") {
      const { value: tipValue, tipper: funder } = timelineItem.args;
      fields = [
        {
          value: <Funder address={funder} value={tipValue} />,
        },
      ];
    } else if (timelineItem.method === "closeTip") {
      const who = timelineItem.args.terminator;
      fields = [
        {
          title: "Closed by",
          value: <User address={who} />,
        },
        {
          title: "Beneficiary",
          value: <User address={tipDetail.beneficiary} />,
        },
        {
          title: "Final tip value",
          value: (
            <Balance
              value={tipDetail.medianValue}
              usdt={tipDetail.symbolPrice}
              horizontal
            />
          ),
        },
      ];
    } else if (timelineItem.method === "retractTip") {
      const who = timelineItem.args.terminator;
      fields = [
        {
          title: "Retracted by",
          value: <User address={who} />,
        },
      ];
    }

    return {
      extrinsicIndexer: timelineItem.indexer,
      name: timelineItem.method,
      fields,
    };
  });
}

const TipDetail = () => {
  useChainRoute();

  const { tipId } = useParams();
  const dispatch = useDispatch();
  const [timelineData, setTimelineData] = useState([]);
  const chain = useSelector(chainSelector);

  useEffect(() => {
    dispatch(fetchTipDetail(chain, tipId));
    dispatch(fetchTipCountdown(chain));
    return () => {
      dispatch(setTipDetail({}));
    };
  }, [dispatch, chain, tipId]);

  const tipDetail = useSelector(tipDetailSelector);
  const loadingTipDetail = useSelector(loadingTipDetailSelector);

  const links = useSelector(linksSelector);

  const getShortTipId = (tipDetail) => {
    if (!tipDetail.hash) return "";
    return `${tipDetail.proposeAtBlockHeight}_${tipDetail.hash.slice(
      0,
      4
    )}...${tipDetail.hash.slice(tipDetail.hash.length - 4)}`;
  };

  const getTipIndex = (tipDetail) => {
    if (!tipDetail.hash) return null;
    return new TipIndex(`${tipDetail.proposeAtBlockHeight}_${tipDetail.hash}`);
  };

  useEffect(() => {
    setTimelineData(processTimeline(tipDetail, links));
  }, [tipDetail, links]);

  return (
    <>
      <DetailGoBack />
      <DetailTableWrapper title="Tip" desc={getShortTipId(tipDetail)}>
        <InformationTable loading={loadingTipDetail} />
        <TipLifeCycleTable loading={loadingTipDetail} />
        <RelatedLinks type="tip" index={getTipIndex(tipDetail)} />
      </DetailTableWrapper>
      <TimelineCommentWrapper>
        <Timeline data={timelineData} loading={loadingTipDetail} />
        <Comment type="tip" index={getTipIndex(tipDetail)} />
      </TimelineCommentWrapper>
    </>
  );
};

export default TipDetail;

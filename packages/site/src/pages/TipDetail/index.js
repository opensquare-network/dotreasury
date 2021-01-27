import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import styled from "styled-components";
import { hexToString } from "@polkadot/util";
import {
  fetchTipCountdown,
  fetchTipDetail,
  fetchTipFindersFee,
  loadingTipDetailSelector,
  tipDetailSelector,
} from "../../store/reducers/tipSlice";
import {
  fetchLinks,
  linksSelector,
  TipIndex,
} from "../../store/reducers/linkSlice";

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

function processTimeline(tipDetail, links) {
  return (tipDetail.timeline || []).map((timelineItem) => {
    let fields = [];

    if (timelineItem.method === "reportAwesome") {
      const { reason, who: beneficiary, finder } = timelineItem.args;
      const reasonText = hexToString(reason);
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
          value: <ClickableLink links={links}>{reasonText}</ClickableLink>,
        },
      ];
    } else if (timelineItem.method === "tipNew") {
      const {
        tip_value: tipValue,
        who: beneficiary,
        reason,
        finder,
      } = timelineItem.args;
      const reasonText = hexToString(reason);
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
          value: <Balance value={tipValue} />,
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
          value: <Balance value={tipDetail.medianValue} />,
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
      extrinsicIndexer: timelineItem.extrinsic.extrinsicIndexer,
      name: timelineItem.method,
      fields,
    };
  });
}

const TipDetail = () => {
  const { tipId } = useParams();
  const dispatch = useDispatch();
  const [timelineData, setTimelineData] = useState([]);

  useEffect(() => {
    dispatch(fetchTipDetail(tipId));
    dispatch(fetchTipFindersFee());
    dispatch(fetchTipCountdown());
    dispatch(fetchLinks("tips", tipId));
  }, [dispatch, tipId]);

  const tipDetail = useSelector(tipDetailSelector);
  const loadingTipDetail = useSelector(loadingTipDetailSelector);

  const links = useSelector(linksSelector);

  useEffect(() => {
    setTimelineData(processTimeline(tipDetail, links));
  }, [tipDetail, links]);

  return (
    <>
      <DetailGoBack />
      <TableWrapper>
        <InformationTable loading={loadingTipDetail} />
        <TipLifeCycleTable loading={loadingTipDetail} />
      </TableWrapper>
      <RelatedLinks type="tips" index={new TipIndex(tipId)} />
      <TimelineCommentWrapper>
        <Timeline data={timelineData} loading={loadingTipDetail} />
        <Comment type="tips" index={new TipIndex(tipId)} />
      </TimelineCommentWrapper>
    </>
  );
};

export default TipDetail;

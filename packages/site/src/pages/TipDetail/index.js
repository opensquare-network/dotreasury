import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from 'react-router'
import styled from "styled-components";
import { Image, Divider } from "semantic-ui-react";
import { useHistory } from "react-router-dom";
import { hexToString } from "@polkadot/util";
import {
  fetchTipDetail,
  fetchTipFindersFee,
  fetchTipCountdown,
  tipDetailSelector,
} from "../../store/reducers/tipSlice";
import {
  fetchCurrentBlockHeight,
} from "../../store/reducers/chainSlice";

import InformationTable from "./InformationTable";
import TipLefeCycleTable from "./TipLifeCycleTable";
import Timeline from "../Timeline";
import Comment from "../Comment";
import RelatedLinks from "../RelatedLinks";
import Title from "../../components/Title";
import User from "../../components/User/Index";
import Balance from "../../components/Balance";

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

function createContentBuilder(tipDetail) {
  return (timelineItem) => {
    if (timelineItem.extrinsic.name === 'reportAwesome') {
      const { reason, who: beneficiary } = timelineItem.extrinsic.args;
      const finder = timelineItem.extrinsic.signer;
      const reasonText = hexToString(reason);
      return [{
        title: "Finder",
        value: <User address={finder} />,
      }, {
        title: "Beneficiary",
        value: <User address={beneficiary} />,
      }, {
        title: "Reason",
        value: reasonText,
      }]
    } else if (timelineItem.extrinsic.name === 'tipNew') {
      const { tip_value: tipValue, who: beneficiary, reason } = timelineItem.extrinsic.args;
      const finder = timelineItem.extrinsic.signer;
      const reasonText = hexToString(reason);
      return [{
        title: "Funder",
        value: <User address={finder} />,
      }, {
        title: "Beneficiary",
        value: <User address={beneficiary} />,
      }, {
        title: "Tip value",
        value: <Balance value={tipValue} />,
      }, {
        title: "Reason",
        value: reasonText,
      }]
    } else if (timelineItem.extrinsic.name === 'tip') {
      const { tip_value: tipValue } = timelineItem.extrinsic.args;
      const funder = timelineItem.extrinsic.signer;
      return [{
        title: "Funder",
        value: <User address={funder} />,
      }, {
        title: "Tip value",
        value: <Balance value={tipValue} />,
      }]
    } else if (timelineItem.extrinsic.name === 'closeTip') {
      const who = timelineItem.extrinsic.signer;
      return [{
        title: "Close by",
        value: <User address={who} />,
      }, {
        title: "Beneficiary",
        value: <User address={tipDetail.beneficiary} />,
      }, {
        title: "Final tip value",
        value: <Balance value={tipDetail.medianValue} />,
      }]
    } else if (timelineItem.extrinsic.name === 'retractTip') {
      const who = timelineItem.extrinsic.signer;
      return [{
        title: "Retract by",
        value: <User address={who} />,
      }]
    }

    return [];
  }
}

const TipDetail = () => {
  const history = useHistory();
  const { tipId } = useParams()
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchTipDetail(tipId));
    dispatch(fetchTipFindersFee());
    dispatch(fetchTipCountdown());
    dispatch(fetchCurrentBlockHeight());
  }, [dispatch, tipId]);

  const tipDetail = useSelector(tipDetailSelector);

  return (
    <>
      <HeaderWrapper>
        <div onClick={() => history.goBack()}>
          <Image src="/imgs/left-arrow.svg" width={"32px"} height={"32px"} />
        </div>
        <Title>Detail</Title>
      </HeaderWrapper>
      <TableWrapper>
        <InformationTable />
        <TipLefeCycleTable />
      </TableWrapper>
      <RelatedLinks />
      <Divider />
      <TimelineCommentWrapper>
        <Timeline data={tipDetail.timeline} contentBuilder={createContentBuilder(tipDetail)} />
        <Comment />
      </TimelineCommentWrapper>
    </>
  );
};

export default TipDetail;

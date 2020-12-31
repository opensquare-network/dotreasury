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
  loadingTipDetailSelector,
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

function getProxyMethod(callArgs) {
  const methodsMapping = [
    [["hash", "tip_value"], "tip"],
    [["reason", "who"], "reportAwesome"],
  ];

  for (const [expectArgs, method] of methodsMapping) {
    if (JSON.stringify(Object.keys(callArgs)) === JSON.stringify(expectArgs)) {
      return method;
    }
  }

  return "";
}

function processProxyExtrinsic(extrinsic) {
  if (extrinsic.section !== 'proxy' || extrinsic.name !== 'proxy') {
    return extrinsic;
  }

  const { signer, args: { call: { callIndex, args } }, extrinsicIndexer } = extrinsic;

  const name = getProxyMethod(args);
  if (name) {
    return {
      name,
      args,
      signer,
      extrinsicIndexer,
    }
  }

  return {
    name: `Proxy(${callIndex})`,
    args,
    signer,
    extrinsicIndexer,
  }
}

function processTimeline(tipDetail) {
  return (tipDetail.timeline || []).map(timelineItem => {
    const extrinsic = processProxyExtrinsic(timelineItem.extrinsic);
    let fields = [];

    if (extrinsic.name === 'reportAwesome') {
      const { reason, who: beneficiary } = extrinsic.args;
      const finder = extrinsic.signer;
      const reasonText = hexToString(reason);
      fields = [{
        title: "Finder",
        value: <User address={finder} />,
      }, {
        title: "Beneficiary",
        value: <User address={beneficiary} />,
      }, {
        title: "Reason",
        value: reasonText,
      }]
    } else if (extrinsic.name === 'tipNew') {
      const { tip_value: tipValue, who: beneficiary, reason } = extrinsic.args;
      const finder = extrinsic.signer;
      const reasonText = hexToString(reason);
      fields = [{
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
    } else if (extrinsic.name === 'tip') {
      const { tip_value: tipValue } = extrinsic.args;
      const funder = extrinsic.signer;
      fields = [{
        title: "Funder",
        value: <User address={funder} />,
      }, {
        title: "Tip value",
        value: <Balance value={tipValue} />,
      }]
    } else if (extrinsic.name === 'closeTip') {
      const who = extrinsic.signer;
      fields = [{
        title: "Close by",
        value: <User address={who} />,
      }, {
        title: "Beneficiary",
        value: <User address={tipDetail.beneficiary} />,
      }, {
        title: "Final tip value",
        value: <Balance value={tipDetail.medianValue} />,
      }]
    } else if (extrinsic.name === 'retractTip') {
      const who = extrinsic.signer;
      fields = [{
        title: "Retract by",
        value: <User address={who} />,
      }]
    }

    return {
      ...extrinsic,
      fields,
    }
  });
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
  const loadingTipDetail = useSelector(loadingTipDetailSelector);

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
        <Timeline data={processTimeline(tipDetail)} polkassembly={false} loading={loadingTipDetail} />
        <Comment />
      </TimelineCommentWrapper>
    </>
  );
};

export default TipDetail;

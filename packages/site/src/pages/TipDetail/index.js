import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import styled from "styled-components";
import { Divider, Image } from "semantic-ui-react";
import { useHistory } from "react-router-dom";
import { hexToString } from "@polkadot/util";
import {
  fetchTipCountdown,
  fetchTipDetail,
  fetchTipFindersFee,
  loadingTipDetailSelector,
  tipDetailSelector,
} from "../../store/reducers/tipSlice";

import InformationTable from "./InformationTable";
import Timeline from "../Timeline";
import Comment from "../Comment";
import RelatedLinks from "../RelatedLinks";
import Title from "../../components/Title";
import User from "../../components/User";
import Balance from "../../components/Balance";
import TipLifeCycleTable from "./TipLifeCycleTable";
import { getCall } from "../../services/metadata";
import Funder from "./Funder";

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

async function getProxyMethod(blockHash, hexCallIndex) {
  const call = await getCall(blockHash, hexCallIndex);
  return call.method;
}

async function processProxyExtrinsic(extrinsic) {
  if (extrinsic.section !== "proxy" || extrinsic.name !== "proxy") {
    return extrinsic;
  }

  const {
    args: {
      real,
      call: { callIndex: hexCallIndex, args },
    },
    extrinsicIndexer,
  } = extrinsic;

  const name = await getProxyMethod(extrinsicIndexer.blockHash, hexCallIndex);
  if (name) {
    return {
      name,
      args,
      signer: real,
      extrinsicIndexer,
    };
  }

  return {
    name: `Proxy(${hexCallIndex})`,
    args,
    signer: real,
    extrinsicIndexer,
  };
}

async function processTimeline(tipDetail) {
  return await Promise.all(
    (tipDetail.timeline || []).map(async (timelineItem) => {
      const extrinsic = await processProxyExtrinsic(timelineItem.extrinsic);
      let fields = [];

      if (extrinsic.name === "reportAwesome") {
        const { reason, who: beneficiary } = extrinsic.args;
        const finder = extrinsic.signer;
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
            value: reasonText,
          },
        ];
      } else if (extrinsic.name === "tipNew") {
        const { tip_value: tipValue, who: beneficiary, reason } = extrinsic.args;
        const finder = extrinsic.signer;
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
            value: reasonText,
          },
        ];
      } else if (extrinsic.name === "tip") {
        const { tip_value: tipValue } = extrinsic.args;
        const funder = extrinsic.signer;
        fields = [
          {
            value: <Funder address={funder} value={tipValue} />
          }
        ];
      } else if (extrinsic.name === "closeTip") {
        const who = extrinsic.signer;
        fields = [
          {
            title: "Close by",
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
      } else if (extrinsic.name === "retractTip") {
        const who = extrinsic.signer;
        fields = [
          {
            title: "Retract by",
            value: <User address={who} />,
          },
        ];
      }

      return {
        ...extrinsic,
        fields,
      };
    })
  );
}

const TipDetail = () => {
  const history = useHistory();
  const { tipId } = useParams();
  const dispatch = useDispatch();
  const [timelineData, setTimelineData] = useState([]);

  useEffect(() => {
    dispatch(fetchTipDetail(tipId));
    dispatch(fetchTipFindersFee());
    dispatch(fetchTipCountdown());
  }, [dispatch, tipId]);

  const tipDetail = useSelector(tipDetailSelector);
  const loadingTipDetail = useSelector(loadingTipDetailSelector);

  useEffect(() => {
    (async () => {
      setTimelineData(await processTimeline(tipDetail));
    })();
  }, [tipDetail]);

  return (
    <>
      <HeaderWrapper>
        <div onClick={() => history.goBack()}>
          <Image src="/imgs/left-arrow.svg" width={"32px"} height={"32px"} />
        </div>
        <Title>Detail</Title>
      </HeaderWrapper>
      <TableWrapper>
        <InformationTable loading={loadingTipDetail} />
        <TipLifeCycleTable loading={loadingTipDetail} />
      </TableWrapper>
      <RelatedLinks />
      <Divider />
      <TimelineCommentWrapper>
        <Timeline
          data={timelineData}
          polkassembly={false}
          loading={loadingTipDetail}
        />
        <Comment />
      </TimelineCommentWrapper>
    </>
  );
};

export default TipDetail;

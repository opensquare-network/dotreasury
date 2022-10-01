import styled from "styled-components";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import { Image } from "semantic-ui-react";
import { NavLink } from "react-router-dom";
import { chainSymbolSelector } from "../../store/reducers/chainSlice";
import ExplorerLink from "../ExplorerLink";
import Text from "../Text";
import TextMinor from "../TextMinor";
import PolygonLabel from "../PolygonLabel";
import User from "../User";
import Balance from "../Balance";
import RightButton from "../RightButton";
import BeneficiaryContent from "../../pages/Proposals/BeneficiaryContent";
import DescriptionCell from "../../pages/Proposals/DescriptionCell";
import RelatedLinks from "../RelatedLinks";
import PairTextVertical from "../PairTextVertical";
import TextWrapper from "./TextWrapper";
import TextLinks from "./TextLinks";
import { TipStatus, USER_ROLES } from "../../constants";

const ProposeTimeWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  p:first-child {
    min-width: 154px;
  }
  > :first-child {
    line-height: 22px;
    color: rgba(0, 0, 0, 0.9) !important;
  }
  > :last-child {
    * {
      font-size: 12px;
      line-height: 18px;
      color: rgba(0, 0, 0, 0.3);
    }
    img {
      width: 14px !important;
      height: 14px !important;
    }
  }
`;

const EventWrapper = styled.div`
  display: flex;
  align-items: center;
  & > img {
    margin-right: 4px;
  }
`;

const EventID = styled(Text)`
  white-space: nowrap;
  &:hover {
    text-decoration-line: underline;
  }
`;

const CapText = styled(Text)`
  text-transform: capitalize;
  white-space: nowrap;
`;

export const getBountyStateWithVotingAyes = (item) => {
  const state = item.state?.state;
  const isVoting = ["ApproveVoting", "RejectVoting"].includes(state);

  if (isVoting) {
    const nAyes = item.state.data.motionVoting?.ayes?.length;
    if (nAyes !== undefined) {
      return state + ` (${nAyes})`;
    }
  }
  return state;
};

const getProposalStateWithVotingAyes = (item) => {
  const { state: stateValue, name } = item.latestState;
  const state = stateValue || name;
  const isProposalVoting = ["ApproveVoting", "RejectVoting"].includes(state);

  if (isProposalVoting) {
    const nAyes = item.latestState.motionVoting?.ayes?.length;
    if (nAyes !== undefined) {
      return state + ` (${nAyes})`;
    }
  }

  return state;
};

const proposeTime = {
  key: "propose-time",
  title: "Propose Time",
  cellClassName: "propose-time-cell",
  cellRender: (_, item) => (
    <ProposeTimeWrapper>
      <TextMinor>
        {dayjs(parseInt(item.proposeTime)).format("YYYY-MM-DD HH:mm:ss")}
      </TextMinor>
      <ExplorerLink href={`/block/${item.proposeAtBlockHeight}`}>
        <PolygonLabel fontSize={12} value={item.proposeAtBlockHeight} />
      </ExplorerLink>
    </ProposeTimeWrapper>
  ),
};
const time = {
  key: "time",
  title: "Time",
  cellClassName: "propose-time-cell",
  cellRender: (_, item) => (
    <ProposeTimeWrapper>
      <Text>
        {dayjs(parseInt(item.indexer.blockTime)).format("YYYY-MM-DD HH:mm:ss")}
      </Text>
      <ExplorerLink href={`/block/${item.indexer.blockHeight}`}>
        <PolygonLabel fontSize={12} value={item.indexer.blockHeight} />
      </ExplorerLink>
    </ProposeTimeWrapper>
  ),
};
const eventId = {
  key: "event-id",
  title: "Event ID",
  cellRender: (_, item) => (
    <ExplorerLink
      href={`/extrinsic/${item.indexer.blockHeight}-0?event=${item.indexer.blockHeight}-${item.indexer.eventIndex}`}
    >
      <EventWrapper>
        <Image src={"/imgs/event.svg"} />
        <EventID>{`${item.indexer.blockHeight}-${item.indexer.eventIndex}`}</EventID>
      </EventWrapper>
    </ExplorerLink>
  ),
};
const value = (symbol) => ({
  key: "value",
  title: "Value",
  headerCellProps: { textAlign: "right" },
  cellProps: { textAlign: "right" },
  cellClassName: "balance-cell",
  cellRender: (_, item) => (
    <Balance value={item.value} currency={symbol} usdt={item.symbolPrice} />
  ),
});
const per = {
  key: "per",
  title: "Per",
  headerCellProps: { textAlign: "right" },
  cellProps: { textAlign: "right" },
  dataIndex: "burnPercent",
  cellClassName: "balance-cell",
};
const remnant = (symbol) => ({
  key: "remnant",
  title: "Remnant",
  headerCellProps: { textAlign: "right" },
  cellProps: { textAlign: "right" },
  dataIndex: "burnPercent",
  cellClassName: "balance-cell",
  cellRender: (_, item) =>
    parseInt(item.treasuryBalance) <= 0 ? (
      "--"
    ) : (
      <Balance value={item.treasuryBalance} currency={symbol} />
    ),
});
const bountyIndex = {
  key: "index",
  title: "Index",
  dataIndex: "bountyIndex",
  cellClassName: "index-cell",
  cellRender: (value) => <TextMinor>#{value}</TextMinor>,
};
const curator = {
  key: "curator",
  title: "Curator",
  dataIndex: "curator",
  headerCellClassName: "curator-header",
  cellClassName: "user-cell",
  cellRender: (_, item) =>
    item.curator ? (
      <User role={USER_ROLES.Proposer} address={item.curator} />
    ) : (
      "--"
    ),
};
const title = (options) => ({
  key: "title",
  title: "Title",
  dataIndex: "title",
  cellClassName: "title-cell",
  cellRender: (value, item) => {
    if (options.recognizeLinks) {
      return (
        <TextWrapper maxWidth={347}>
          <TextLinks text={item.title} />
        </TextWrapper>
      );
    }
    return item.title;
  },
});
const bountiesStatus = {
  key: "status",
  title: "Status",
  headerCellProps: { textAlign: "right" },
  cellProps: { textAlign: "right" },
  cellClassName: "status-cell",
  cellRender: (_, item) => (
    <CapText>{getBountyStateWithVotingAyes(item)}</CapText>
  ),
};
const detailRoute = (options) => ({
  key: "detail-route",
  title: "",
  headerCellClassName: "hidden",
  cellClassName: "link-cell hidden",
  cellRender: (_, item) => {
    return (
      <NavLink to={options?.getDetailRoute?.(item) ?? ""}>
        <RightButton />
      </NavLink>
    );
  },
});
const beneficiary = {
  key: "beneficiary",
  title: "Beneficiary",
  headerCellClassName: "proposal-beneficiary-header",
  cellClassName: "proposal-user-cell proposal-beneficiary-cell user-cell",
  cellRender: (_, item) =>
    item.beneficiary ? (
      <User
        role={USER_ROLES.Beneficiary}
        address={item.beneficiary}
        popupContent={
          <BeneficiaryContent
            proposerAddress={item.proposer}
            beneficiaryAddress={item.beneficiary}
          />
        }
      />
    ) : (
      "--"
    ),
};
const proposer = {
  key: "proposer",
  title: "Proposer",
  headerCellClassName: "proposal-proposer-header",
  cellClassName: "proposal-user-cell proposal-proposer-cell user-cell",
  cellRender: (_, item) => (
    <User
      role={USER_ROLES.Proposer}
      address={item.proposer}
      popupContent={
        <BeneficiaryContent
          proposerAddress={item.proposer}
          beneficiaryAddress={item.beneficiary}
        />
      }
    />
  ),
};
const proposalIndex = {
  ...bountyIndex,
  dataIndex: "proposalIndex",
};
const description = {
  key: "description",
  title: "Description",
  cellClassName: "proposal-description-cell",
  cellRender: (_, item) => (
    <DescriptionCell description={item.description} tags={item.tags} />
  ),
};
const relatedLinks = (options) => ({
  key: "related-links",
  title: options?.compact ? "Links" : "Related Links",
  cellClassName: "proposal-related-links-cell",
  cellRender: (_, item) => (
    <RelatedLinks links={options?.getRelatedLinks?.(item)} />
  ),
});
const proposalStatus = {
  key: "proposal-status",
  title: "Status",
  headerCellProps: { textAlign: "right" },
  cellProps: { textAlign: "right" },
  cellClassName: "proposal-status-cell",
  cellRender: (_, item) => (
    <PairTextVertical
      value={getProposalStateWithVotingAyes(item)}
      detail={dayjs(parseInt(item.latestState.time)).format("YYYY-MM-DD HH:mm")}
    />
  ),
};
const tipsBeneficiary = {
  key: "beneficiary",
  title: "Beneficiary",
  cellClassName: "user-cell",
  cellRender: (_, item) => (
    <User role={USER_ROLES.Beneficiary} address={item.beneficiary} />
  ),
};
const finder = {
  key: "finder",
  title: "Finder",
  headerCellClassName: "hidden",
  cellClassName: "user-cell hidden",
  cellRender: (_, item) => (
    <User role={USER_ROLES.Proposer} address={item.finder} />
  ),
};
const reason = {
  key: "reason",
  title: "Reason",
  cellRender: (_, item) => (
    <TextWrapper>
      <TextLinks text={item.reason} />
    </TextWrapper>
  ),
};
const tipsValue = (symbol) => {
  const v = value(symbol);

  return {
    ...v,
    key: "tips-value",
    cellRender: (_, item) => {
      if (item.showStatus === TipStatus.Retracted) {
        return "--";
      }

      item.value = item.medianValue;
      return v.cellRender(_, item);
    },
  };
};
const tipsStatus = {
  key: "tips-status",
  title: "Status",
  headerCellProps: { textAlign: "right" },
  cellProps: { textAlign: "right" },
  cellClassName: "status-cell short-padding",
  cellRender: (_, item) =>
    item.showTime ? (
      <PairTextVertical
        value={item.showStatus}
        detail={dayjs(parseInt(item.latestState.time)).format(
          "YYYY-MM-DD HH:mm"
        )}
      />
    ) : item.showStatus === TipStatus.Tipping ? (
      `${item.showStatus} (${item.tipsCount})`
    ) : (
      item.showStatus
    ),
};
const burntValue = (symbol) => {
  const v = value(symbol);

  return {
    ...v,
    key: "burnt-value",
    cellRender: (_, item) => {
      return <Balance value={item.balance} currency={symbol} />;
    },
  };
};

export function useTableColumns(options) {
  const symbol = useSelector(chainSymbolSelector);

  return {
    proposeTime,
    time,
    eventId,
    value: value(symbol),
    per,
    remnant: remnant(symbol),
    bountyIndex,
    curator,
    title: title(options),
    bountiesStatus,
    detailRoute: detailRoute(options),
    beneficiary,
    proposer,
    proposalIndex,
    description,
    relatedLinks: relatedLinks(options),
    proposalStatus,
    tipsBeneficiary,
    finder,
    reason,
    tipsStatus,
    tipsValue: tipsValue(symbol),
    burntValue: burntValue(symbol),
  };
}

import styled from "styled-components";
import { Image } from "semantic-ui-react";
import { NavLink } from "react-router-dom";
import { p_14_medium, p_14_normal } from "../../styles/text";
import ProjectExpense from "../../components/ProjectExpense";
import { ellipsis } from "../../utils/ellipsis";
import ButtonList from "../../pages/Timeline/ButtonList";
import { networkFromSymbol } from "../../utils";
import dayjs from "dayjs";

const ProposalLink = styled(NavLink)`
  display: inline-flex;
  align-items: center;
`;

const ProposalType = styled.p`
  margin: 0;
  margin-left: 4px;
  /* text-dark/major */
  color: rgba(0, 0, 0, 0.9);
  ${p_14_medium};
`;

const ProposalId = styled.p`
  margin: 0;
  margin-left: 4px;
  /* primary/theme-pink-500 */
  color: #f23252;
  ${p_14_medium};
`;

const ProposalDetailWrapper = styled.div`
  margin-top: 8px;
`;

const ProposalDetail = styled.div`
  display: flex;
  padding: 6px 0;
`;

const ProposalDetailLabel = styled.div`
  min-width: 160px;
  /* text-dark/minor */
  color: rgba(0, 0, 0, 0.65);
  ${p_14_normal};
`;

const ProposalDetailValue = styled.div`
  flex: 1 1 auto;
  /* text-dark/major */
  color: rgba(0, 0, 0, 0.9);
  ${p_14_normal};
`;

const ProposalDetailAchievement = styled.ol`
  list-style: number inside !important;
`;
const ProposalDetailAchievementItem = styled.li`
  list-style: inherit !important;
  ${p_14_normal};
`;

function getFundLink(item = {}) {
  if (item.type === types.tip) {
    return `tips/${item.tipId}`;
  } else if (item.type === types.childBounty) {
    return `child-bounties/${item.id}`;
  } else if (item.type === types.proposal) {
    return `proposals/${item.proposalId}`;
  }

  throw new Error(`Unknown project fund type ${item?.type}`);
}

const types = Object.freeze({
  proposal: "proposal",
  tip: "tip",
  childBounty: "child-bounty",
});

function getFundId(item = {}) {
  if (item.type === types.tip) {
    return item.tipId;
  } else if (item.type === types.childBounty) {
    return item.id;
  } else if (item.type === types.proposal) {
    return item.proposalId;
  }

  throw new Error(`Unknown project fund type ${item?.type}`);
}

function getFundTypeName(type) {
  if (type === types.tip) {
    return "Tip";
  } else if (type === types.childBounty) {
    return "Child Bounty";
  } else if (type === types.proposal) {
    return "Proposal";
  }

  throw new Error(`Unknown project fund type ${type}`);
}

export default function ProposalInfo({ item }) {
  const link = getFundLink(item);
  const id = getFundId(item);

  const isKSM = item.token === "ksm";
  const isProposal = item.type === types.proposal;

  return (
    <div>
      <ProposalLink to={`/${item.token}/${link}`}>
        <Image
          width={24}
          src={isKSM ? "/imgs/logo-kusama.svg" : "/imgs/logo-polkadot.svg"}
        />
        <ProposalType>{getFundTypeName(item.type)}</ProposalType>
        <ProposalId>#{isProposal ? id : ellipsis(id || "")}</ProposalId>
      </ProposalLink>
      <ProposalDetailWrapper>
        <ProposalDetail>
          <ProposalDetailLabel>Title</ProposalDetailLabel>
          <ProposalDetailValue>{item.title ?? item.reason}</ProposalDetailValue>
        </ProposalDetail>
        <ProposalDetail>
          <ProposalDetailLabel>Proposed time</ProposalDetailLabel>
          <ProposalDetailValue>
            {dayjs(item?.indexer?.blockTime).format("YYYY-MM-DD HH:mm:ss")}
          </ProposalDetailValue>
        </ProposalDetail>
        <ProposalDetail>
          <ProposalDetailLabel>
            {item.type === "tip" ? "Tip" : "Expense"}
          </ProposalDetailLabel>
          <ProposalDetailValue>
            <ProjectExpense
              expenseDot={!isKSM && item.value}
              expenseKsm={isKSM && item.value}
              dollar={item.fiatValue}
            />
          </ProposalDetailValue>
        </ProposalDetail>
        {!!item?.achievements?.length && (
          <ProposalDetail>
            <ProposalDetailLabel>Achievement</ProposalDetailLabel>
            <ProposalDetailValue>
              <ProposalDetailAchievement>
                {item.achievements.map((i) => (
                  <ProposalDetailAchievementItem key={i}>
                    {i}
                  </ProposalDetailAchievementItem>
                ))}
              </ProposalDetailAchievement>
            </ProposalDetailValue>
          </ProposalDetail>
        )}
      </ProposalDetailWrapper>

      <ButtonList
        extrinsicIndexer={item.indexer}
        eventIndexer={item.indexer}
        type={item.type}
        chain={networkFromSymbol(item.token)}
      />
    </div>
  );
}

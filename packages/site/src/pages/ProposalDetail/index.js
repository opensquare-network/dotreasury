import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import styled from "styled-components";
import { Divider, Image } from "semantic-ui-react";
import { useHistory } from "react-router-dom";
import {
  fetchProposalDetail,
  loadingProposalDetailSelector,
} from "../../store/reducers/proposalSlice";

import InformationTable from "./InformationTable";
import Timeline from "../Timeline";
import Comment from "../Comment";
import RelatedLinks from "../RelatedLinks";
import Title from "../../components/Title";
import ProposalLifeCycleTable from "./ProposalLifeCycleTable";

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

const ProposalDetail = () => {
  const history = useHistory();
  const { proposalIndex } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchProposalDetail(proposalIndex));
  }, [dispatch, proposalIndex]);

  const loadingProposalDetail = useSelector(loadingProposalDetailSelector);

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
        <ProposalLifeCycleTable />
      </TableWrapper>
      <RelatedLinks />
      <Divider />
      <TimelineCommentWrapper>
        <Timeline
          data={[]}
          loading={loadingProposalDetail}
        />
        <Comment />
      </TimelineCommentWrapper>
    </>
  );
};

export default ProposalDetail;

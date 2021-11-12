import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";

import Table from "../../components/Table";
import TableLoading from "../../components/TableLoading";
import TableCell from "../../components/TableCell";
import DateShow from "../../components/DateShow";
import PolygonLabel from "../../components/PolygonLabel";
import ExplorerLink from "../../components/ExplorerLink";
import RelatedLinks from "../../components/RelatedLinks";

import { useIsMounted } from "../../utils/hooks";
import polkaassemblyApi from "../../services/polkassembly";
import { proposalDetailSelector } from "../../store/reducers/proposalSlice";

const FlexWrapper = styled.div`
  display: flex;
  align-items: center;
  > :not(:first-child) {
    margin-left: 16px;
  }
`;

const ProposalLifeCycleTable = ({ loading }) => {
  const proposalDetail = useSelector(proposalDetailSelector);
  const [proposalUrl, setProposalUrl] = useState(null);
  const isMounted = useIsMounted();

  useEffect(() => {
    (async () => {
      if (proposalDetail) {
        const url = await polkaassemblyApi.getProposalUrl(
          proposalDetail.proposalIndex
        );
        if (isMounted.current) {
          setProposalUrl(url);
        }
      } else {
        setProposalUrl(null);
      }
    })();
  }, [proposalDetail, isMounted]);

  return (
    <TableLoading loading={loading}>
      <Table unstackable>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Proposal Life Cycle</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.Cell>
              <TableCell title={"Created"}>
                <FlexWrapper>
                  <div>
                    <DateShow value={proposalDetail.proposeTime} />
                  </div>
                  <ExplorerLink
                    href={`/block/${proposalDetail.proposeAtBlockHeight}`}
                  >
                    <PolygonLabel value={proposalDetail.proposeAtBlockHeight} />
                  </ExplorerLink>
                </FlexWrapper>
              </TableCell>
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>
              <TableCell title="Status">
                <FlexWrapper>
                  <div>{
                    proposalDetail.latestState?.state ||
                    proposalDetail.latestState?.name
                  }</div>
                </FlexWrapper>
              </TableCell>
            </Table.Cell>
          </Table.Row>
          {proposalUrl && (
            <Table.Row>
              <Table.Cell>
                <TableCell title="Proposal Page">
                  <RelatedLinks
                    links={[
                      {
                        link: proposalUrl,
                        description: "Treasury proposal discusssion",
                      },
                    ]}
                  />
                </TableCell>
              </Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table>
    </TableLoading>
  );
};

export default ProposalLifeCycleTable;

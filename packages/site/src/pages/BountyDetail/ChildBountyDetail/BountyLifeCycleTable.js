import React from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import Table from "../../../components/Table";
import TableLoading from "../../../components/TableLoading";
import TableCell from "../../../components/TableCell";
import User from "../../../components/User";
import Text from "../../../components/Text";
import {
  chainSelector,
  scanHeightSelector,
} from "../../../store/reducers/chainSlice";
import Label from "../../../components/Label";
import DateShow from "../../../components/DateShow";
import PolygonLabel from "../../../components/PolygonLabel";
import ExplorerLink from "../../../components/ExplorerLink";
import { childBountyDetailSelector } from "../../../store/reducers/bountySlice";
import RelatedLinks from "../../../components/RelatedLinks";
import EstimateBlockTimeCountDown from "../../../components/EstimateBlockTimeCountdown";

const FlexWrapper = styled.div`
  display: flex;
  align-items: center;
  > :not(:first-child) {
    margin-left: 16px;
  }
`;

const CapText = styled(Text)`
  text-transform: capitalize;
`;

const BountyLifeCycleTable = ({ loading }) => {
  const bountyDetail = useSelector(childBountyDetailSelector);
  const scanHeight = useSelector(scanHeightSelector);
  const chain = useSelector(chainSelector);

  const links = [];
  if (["kusama", "polkadot"].includes(chain) && bountyDetail) {
    links.push({
      link: `https://${chain}.subsquare.io/treasury/child-bounty/${bountyDetail.index}`,
      description: "Child bounty discusssion",
    });
  }

  return (
    <TableLoading loading={loading}>
      <Table unstackable>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Bounty Life Cycle</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.Cell>
              <TableCell title={"Created"}>
                <FlexWrapper>
                  <div>
                    <DateShow value={bountyDetail?.indexer?.blockTime} />
                  </div>
                  <ExplorerLink
                    href={`/block/${bountyDetail?.indexer?.blockHeight}`}
                  >
                    <PolygonLabel value={bountyDetail?.indexer?.blockHeight} />
                  </ExplorerLink>
                </FlexWrapper>
              </TableCell>
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>
              <TableCell title="Status">
                <FlexWrapper>
                  <CapText>{bountyDetail.state?.state}</CapText>
                  <div />
                </FlexWrapper>
              </TableCell>
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>
              <TableCell title={"Curator"}>
                {bountyDetail.curator ? (
                  <User address={bountyDetail.curator} />
                ) : (
                  "--"
                )}
              </TableCell>
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>
              <TableCell title={"Beneficiary"}>
                {bountyDetail.beneficiary ? (
                  <User address={bountyDetail.beneficiary} />
                ) : (
                  "--"
                )}
              </TableCell>
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>
              <TableCell
                title={`${
                  scanHeight < bountyDetail.unlockAt ? "Unlock" : "Unlocked"
                } At`}
              >
                {bountyDetail.unlockAt ? (
                  <FlexWrapper>
                    {scanHeight < bountyDetail.unlockAt ? (
                      <>
                        <div>{bountyDetail.unlockAt}</div>
                        <Label>{`${
                          bountyDetail.unlockAt - scanHeight
                        } blocks`}</Label>
                      </>
                    ) : (
                      <ExplorerLink href={`/block/${bountyDetail.unlockAt}`}>
                        <PolygonLabel value={bountyDetail.unlockAt} />
                      </ExplorerLink>
                    )}

                    <EstimateBlockTimeCountDown
                      startBlockHeight={bountyDetail?.indexer?.blockHeight}
                      endBlockHeight={bountyDetail?.unlockAt}
                    />
                  </FlexWrapper>
                ) : (
                  "--"
                )}
              </TableCell>
            </Table.Cell>
          </Table.Row>
          {links.length && (
            <Table.Row>
              <Table.Cell>
                <TableCell title="Child bounty Page">
                  <RelatedLinks links={links} />
                </TableCell>
              </Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table>
    </TableLoading>
  );
};

export default BountyLifeCycleTable;

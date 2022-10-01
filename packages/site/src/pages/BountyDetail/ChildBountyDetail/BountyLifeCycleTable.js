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
import BountyPendingPayoutCountDown from "../../../components/BountyPendingPayoutCountDown";
import { USER_ROLES } from "../../../constants";

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

const CountDownWrapper = styled.div`
  display: inline-flex;
  span {
    color: rgba(0, 0, 0, 0.3);
  }
`;

const BountyLifeCycleTable = ({ loading }) => {
  const bountyDetail = useSelector(childBountyDetailSelector);
  const scanHeight = useSelector(scanHeightSelector);
  const chain = useSelector(chainSelector);
  const awardedItem = [...(bountyDetail?.timeline || [])]
    .reverse()
    .find((item) => item.name === "Awarded");

  const showCountDown = awardedItem && bountyDetail.unlockAt;
  const startCountDownHeight = awardedItem?.indexer?.blockHeight;

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
                  {bountyDetail.state?.state === "PendingPayout" && (
                    <CountDownWrapper>
                      <BountyPendingPayoutCountDown
                        bountyDetail={bountyDetail}
                      />
                    </CountDownWrapper>
                  )}
                </FlexWrapper>
              </TableCell>
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>
              <TableCell title={"Curator"}>
                {bountyDetail.curator ? (
                  <User
                    role={USER_ROLES.Proposer}
                    address={bountyDetail.curator}
                  />
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
                  <User
                    role={USER_ROLES.Beneficiary}
                    address={bountyDetail.beneficiary}
                  />
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
                {showCountDown ? (
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

                    <CountDownWrapper>
                      <EstimateBlockTimeCountDown
                        startBlockHeight={startCountDownHeight}
                        endBlockHeight={bountyDetail?.unlockAt}
                      />
                    </CountDownWrapper>
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

import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";

import Table from "../../components/Table";
import TableLoading from "../../components/TableLoading";
import TableCell from "../../components/TableCell";
import BarProgress from "../../components/BarProgress";
import ElapsedTimeLabel from "../../components/ElapsedTimeLabel";
import DateShow from "../../components/DateShow";
import PolygonLabel from "../../components/PolygonLabel";
import ExplorerLink from "../../components/ExplorerLink";
import EstimateBlockTimeCountDown from "../../components/EstimateBlockTimeCountdown";

import polkaassemblyApi from "../../services/polkassembly";
import { useIsMounted } from "../../utils/hooks";

import { normalizedTipDetailSelector } from "../../store/reducers/tipSlice";
import { chainSelector } from "../../store/reducers/chainSlice";
import RelatedLinks from "../../components/RelatedLinks";

const FlexWrapper = styled.div`
  display: flex;
  align-items: center;
  > :not(:first-child) {
    margin-left: 16px;
  }
`;

const BarWrapper = styled.div`
  max-width: 312px;
  flex: 1 1;
`;

const TippersLabel = styled.div`
  text-align: right;
  color: rgba(29, 37, 60, 0.64);
`;

const TipLifeCycleTable = ({ loading }) => {
  const chain = useSelector(chainSelector);
  const tipDetail = useSelector(normalizedTipDetailSelector);
  const tippersCount = tipDetail.tippersCount;
  const [tipUrl, setTipUrl] = useState(null);
  const isMounted = useIsMounted();

  const thresholdTotalCount = tippersCount ? (tippersCount + 1) / 2 : 0;

  useEffect(() => {
    (async () => {
      if (tipDetail) {
        const url = await polkaassemblyApi.getTipUrl(tipDetail.hash);
        if (isMounted.current) {
          setTipUrl(url);
        }
      } else {
        setTipUrl(null);
      }
    })();
  }, [tipDetail, isMounted]);

  const links = [];
  if (["kusama", "polkadot"].includes(chain) && tipDetail) {
    links.push({
      link: `https://${chain}.subsquare.io/treasury/tip/${tipDetail.proposeAtBlockHeight}_${tipDetail.hash}`,
      description: "Tip proposal discusssion",
    });
  }
  if (tipUrl) {
    links.push({
      link: tipUrl,
      description: "Tip proposal discusssion",
    });
  }

  return (
    <TableLoading loading={loading}>
      <Table unstackable>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Tip Life Cycle</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.Cell>
              <TableCell title={"Created"}>
                <FlexWrapper>
                  <div>
                    <DateShow value={tipDetail.proposeTime} />
                  </div>
                  <ExplorerLink
                    href={`/block/${tipDetail.proposeAtBlockHeight}`}
                  >
                    <PolygonLabel value={tipDetail.proposeAtBlockHeight} />
                  </ExplorerLink>
                </FlexWrapper>
              </TableCell>
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>
              <TableCell title="Status">
                <FlexWrapper>
                  <div>{tipDetail.showStatus}</div>
                  <ElapsedTimeLabel time={tipDetail.latestState?.time} />
                </FlexWrapper>
              </TableCell>
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>
              <TableCell title="Threshold">
                <FlexWrapper>
                  <BarWrapper>
                    <BarProgress
                      total={thresholdTotalCount}
                      current={tipDetail.tipsCount}
                    />
                  </BarWrapper>
                  <TippersLabel>
                    {tipDetail.tipsCount}/{thresholdTotalCount}
                  </TippersLabel>
                </FlexWrapper>
              </TableCell>
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>
              <TableCell title="Closes">
                {tipDetail.closeFromBlockHeight ? (
                  <FlexWrapper>
                    <ExplorerLink
                      href={`/block/${tipDetail.closeFromBlockHeight}`}
                    >
                      <PolygonLabel value={tipDetail.closeFromBlockHeight} />
                    </ExplorerLink>
                    <EstimateBlockTimeCountDown
                      startBlockHeight={tipDetail.proposeAtBlockHeight}
                      endBlockHeight={tipDetail.closeFromBlockHeight}
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
                <TableCell title="Tip Page">
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

export default TipLifeCycleTable;

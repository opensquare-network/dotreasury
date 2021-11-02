import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";

import Table from "../../components/Table";
import TableLoading from "../../components/TableLoading";
import TableCell from "../../components/TableCell";
import Progress from "../../components/Progress";
import TipCountDownLabel from "./TipCountDownLabel";
import BarProgress from "../../components/BarProgress";
import ElapsedTimeLabel from "../../components/ElapsedTimeLabel";
import DateShow from "../../components/DateShow";
import PolygonLabel from "../../components/PolygonLabel";
import ExplorerLink from "../../components/ExplorerLink";

import polkaassemblyApi from "../../services/polkassembly";
import { useIsMounted } from "../../utils/hooks";

import {
  normalizedTipDetailSelector,
  tipCountdownSelector,
} from "../../store/reducers/tipSlice";
import { scanHeightSelector } from "../../store/reducers/chainSlice";
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
  const tipDetail = useSelector(normalizedTipDetailSelector);
  const tipCountdown = useSelector(tipCountdownSelector);
  const scanHeight = useSelector(scanHeightSelector);
  const tippersCount = tipDetail.tippersCount;
  const [tipUrl, setTipUrl] = useState(null);
  const isMounted = useIsMounted();

  const begin = tipDetail.closeFromBlockHeight - tipCountdown;
  const goneBlocks = Math.max(scanHeight - begin, 0);
  const percentage = goneBlocks > tipCountdown ? 1 : goneBlocks / tipCountdown;

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
                    <BarWrapper>
                      <Progress percent={percentage * 100} />
                    </BarWrapper>
                    <TipCountDownLabel
                      scanHeight={scanHeight}
                      closes={tipDetail.closeFromBlockHeight}
                    />
                  </FlexWrapper>
                ) : (
                  <FlexWrapper>
                    <BarWrapper>
                      <Progress percent={0} />
                    </BarWrapper>
                    <TipCountDownLabel
                      scanHeight={scanHeight}
                      closes={tipDetail.closeFromBlockHeight}
                    />
                  </FlexWrapper>
                )}
              </TableCell>
            </Table.Cell>
          </Table.Row>
          {tipUrl && (
            <Table.Row>
              <Table.Cell>
                <TableCell title="Tip Page">
                  <RelatedLinks
                    links={[
                      {
                        link: tipUrl,
                        description: "Tip proposal discusssion",
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

export default TipLifeCycleTable;

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import { Button, Icon, Modal, Form } from "semantic-ui-react";

import Table from "../../components/Table";
import TableLoading from "../../components/TableLoading";
import TableCell from "../../components/TableCell";
import User from "../../components/User";
import Balance from "../../components/Balance";
import { useIsAdmin } from "../../utils/hooks";
import { proposalDetailSelector } from "../../store/reducers/proposalSlice";
import {
  descriptionSelector,
  putDescription,
} from "../../store/reducers/descriptionSlice";
import { nowAddressSelector } from "../../store/reducers/accountSlice";

const IconButton = styled(Icon)`
  margin-left: 6px !important;
  cursor: pointer;
`;

const DescriptionWrapper = styled.div`
  overflow-wrap: break-word;
`;

const StyledTable = styled(Table)`
  table-layout: fixed;
`;

const InformationTable = ({ loading, chain, proposalIndex }) => {
  const dispatch = useDispatch();
  const isAdmin = useIsAdmin();
  const proposalDetail = useSelector(proposalDetailSelector);
  const descriptionDetail = useSelector(descriptionSelector);
  const [openDesModal, setOpenDesModal] = useState(false);
  const [description, setDescription] = useState("");
  const [proposalType, setProposalType] = useState("");
  const [status, setStatus] = useState("");
  const nowAddress = useSelector(nowAddressSelector);

  useEffect(() => {
    if (descriptionDetail?.description) {
      setDescription(descriptionDetail.description?.description ?? "");
      setProposalType(descriptionDetail.description?.proposalType ?? "");
      setStatus(descriptionDetail.description?.status ?? "");
    }
  }, [descriptionDetail]);

  const addDes = () => {
    dispatch(
      putDescription(
        chain,
        "proposal",
        parseInt(proposalIndex),
        description,
        nowAddress
      )
    );
    setOpenDesModal(false);
  };

  return (
    <>
      <TableLoading loading={loading}>
        <StyledTable unstackable>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>
                Information
                {isAdmin && (
                  <IconButton
                    name="plus"
                    onClick={() => setOpenDesModal(!openDesModal)}
                  />
                )}
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            <Table.Row>
              <Table.Cell>
                <TableCell title={"Index"}>
                  {`#${proposalDetail.proposalIndex}`}
                </TableCell>
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>
                <TableCell title={"Proposer"}>
                  <User address={proposalDetail.proposer} />
                </TableCell>
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>
                <TableCell title={"Beneficiary"}>
                  <User address={proposalDetail.beneficiary} />
                </TableCell>
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>
                <TableCell title={"Value"}>
                  <Balance
                    value={proposalDetail.value}
                    usdt={proposalDetail.symbolPrice}
                    horizontal
                  />
                </TableCell>
              </Table.Cell>
            </Table.Row>
            {descriptionDetail?.description?.description && (
              <Table.Row>
                <Table.Cell>
                  <TableCell title={"Description"}>
                    <DescriptionWrapper>
                      {descriptionDetail.description.description}
                    </DescriptionWrapper>
                  </TableCell>
                </Table.Cell>
              </Table.Row>
            )}
            {/* {descriptionDetail?.description?.proposalType && (
              <Table.Row>
                <Table.Cell>
                  <TableCell title={"Proposal type"}>
                    <DescriptionWrapper>
                      {descriptionDetail.description.proposalType}
                    </DescriptionWrapper>
                  </TableCell>
                </Table.Cell>
              </Table.Row>
            )}
            {descriptionDetail?.description?.status && (
              <Table.Row>
                <Table.Cell>
                  <TableCell title={"Status"}>
                    <DescriptionWrapper>
                      {descriptionDetail.description.status}
                    </DescriptionWrapper>
                  </TableCell>
                </Table.Cell>
              </Table.Row>
            )} */}
          </Table.Body>
        </StyledTable>
      </TableLoading>
      <Modal
        size="small"
        open={openDesModal}
        onClose={() => setOpenDesModal(false)}
      >
        <Modal.Header>Description</Modal.Header>
        <Modal.Content>
          <Form>
            <Form.Input
              value={description}
              fluid
              label="Description"
              onChange={(_, { value }) => setDescription(value)}
            />
            {/* <Form.Input
              value={proposalType}
              fluid
              label="Proposal type"
              onChange={(_, { value }) => setProposalType(value)}
            />
            <Form.Input
              value={status}
              fluid
              label="Status"
              onChange={(_, { value }) => setStatus(value)}
            /> */}
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={() => setOpenDesModal(false)}>Cancel</Button>
          <Button onClick={addDes}>OK</Button>
        </Modal.Actions>
      </Modal>
    </>
  );
};

export default InformationTable;

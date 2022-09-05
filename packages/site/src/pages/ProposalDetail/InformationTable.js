import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import { Button, Icon, Modal, Form } from "semantic-ui-react";

import Table from "../../components/Table";
import TableLoading from "../../components/TableLoading";
import TableCell from "../../components/TableCell";
import User from "../../components/User";
import Balance from "../../components/Balance";
import { proposalDetailSelector } from "../../store/reducers/proposalSlice";
import {
  descriptionSelector,
  putDescription,
} from "../../store/reducers/descriptionSlice";
import { accountSelector } from "../../store/reducers/accountSlice";
import Tag from "../../components/Tag";
import { addToast } from "../../store/reducers/toastSlice";
import queryString from "query-string";
import { useLocation } from "react-router";

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

const InformationTable = ({ loading, chain, proposalIndex, proposer }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const proposalDetail = useSelector(proposalDetailSelector);
  const descriptionDetail = useSelector(descriptionSelector);
  const [openDesModal, setOpenDesModal] = useState(false);
  const [description, setDescription] = useState("");
  const [proposalType, setProposalType] = useState("");
  const [status, setStatus] = useState("");
  const account = useSelector(accountSelector);

  const q = queryString.parse(location.search);
  const isAdmin = proposer === account?.address || q.admin === "true";

  useEffect(() => {
    setDescription(descriptionDetail?.description ?? "");
    setProposalType(descriptionDetail?.tags?.proposalType ?? "");
    setStatus(descriptionDetail?.tags?.status ?? "");
  }, [descriptionDetail]);

  const addDes = () => {
    if (!account) {
      dispatch(
        addToast({
          type: "error",
          message: "Please connect wallet",
        })
      );
      return;
    }

    dispatch(
      putDescription(
        chain,
        "proposal",
        parseInt(proposalIndex),
        description,
        proposalType,
        status,
        account.address,
        account.extension,
      )
    );
    setOpenDesModal(false);
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter") {
      addDes();
    }
  }

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
            {descriptionDetail?.description ? (
              <Table.Row>
                <Table.Cell>
                  <TableCell title={"Description"}>
                    <DescriptionWrapper>
                      {descriptionDetail.description}
                    </DescriptionWrapper>
                  </TableCell>
                </Table.Cell>
              </Table.Row>
            ) : null}
            {descriptionDetail?.tags?.proposalType ? (
              <Table.Row>
                <Table.Cell>
                  <TableCell title={"Proposal Type"}>
                    <Tag text={descriptionDetail.tags.proposalType}/>
                  </TableCell>
                </Table.Cell>
              </Table.Row>
            ) : null}
            {descriptionDetail?.tags?.status ? (
              <Table.Row>
                <Table.Cell>
                  <TableCell title={"Work Status"}>
                    <Tag text={descriptionDetail.tags.status}/>
                  </TableCell>
                </Table.Cell>
              </Table.Row>
            ) : null}
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
              onKeyDown={onKeyDown}
            />
            <Form.Select
              options={[
                {text:"————", value:""},
                {text:"Development", value:"Development"},
                {text:"Event", value:"Event"},
                {text:"Maintenance", value:"Maintenance"},
              ]}
              value={proposalType}
              fluid
              label="Proposal Type"
              onChange={(_, { value }) => setProposalType(value)}
              onKeyDown={onKeyDown}
            />
            <Form.Select
              options={[
                {text:"————", value:""},
                {text:"Working", value:"Working"},
                {text:"Review", value:"Review"},
                {text:"Delivered", value:"Delivered"},
              ]}
              value={status}
              fluid
              label="Status"
              onChange={(_, { value }) => setStatus(value)}
              onKeyDown={onKeyDown}
            />
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

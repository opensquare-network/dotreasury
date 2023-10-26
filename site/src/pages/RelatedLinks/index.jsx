import React, { useState } from "react";
import useDeepCompareEffect from "use-deep-compare-effect";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { Button, Icon, Modal, Form } from "semantic-ui-react";
import LinkItem from "../../components/LinkItem";
import {
  setLinks,
  fetchLinks,
  linksSelector,
  addLink,
  removeLink,
} from "../../store/reducers/linkSlice";
import { accountSelector } from "../../store/reducers/accountSlice";
import { chainSelector } from "../../store/reducers/chainSlice";
import Divider from "../../components/Divider";
import Table from "../../components/Table";
import { addToast } from "../../store/reducers/toastSlice";
import { useIsAdminQuery } from "../../utils/hooks";
import { isSameAddress } from "../../utils";
import isNil from "lodash.isnil";

const Wrapper = styled.div`
  table {
    margin-bottom: 0 !important;
  }
`;

const LinkWrapper = styled.div`
  display: flex;
  & > :first-child:not(:last-child) {
    margin-right: 10px;
  }
`;

const IconButton = styled(Icon)`
  margin-left: 6px !important;
  cursor: pointer;
`;

const DividerWrapper = styled(Divider)``;

const RelatedLinks = ({ type, index, owner }) => {
  const dispatch = useDispatch();
  const chain = useSelector(chainSelector);

  useDeepCompareEffect(() => {
    if (!isNil(index)) {
      dispatch(fetchLinks(type, index));
    }
    return () => {
      dispatch(setLinks([]));
    };
  }, [dispatch, type, index]);

  const links = useSelector(linksSelector);
  const account = useSelector(accountSelector);

  const [openAddLinkModal, setOpenAddLinkModal] = useState(false);
  const [openRemoveLinkModal, setOpenRemoveLinkModal] = useState(false);
  const [link, setLink] = useState("");
  const [description, setDescription] = useState("");
  const [linkIndex, setLinkIndex] = useState(null);

  const addRelatedLink = async (link, description) => {
    if (!account) {
      dispatch(
        addToast({
          type: "error",
          message: "Please connect wallet",
        }),
      );
      return;
    }
    setOpenAddLinkModal(false);
    dispatch(
      addLink(
        type,
        index,
        link,
        description,
        account.address,
        account.extension,
      ),
    );
  };

  const removeRelatedLink = async (linkIndex) => {
    if (!account) {
      dispatch(
        addToast({
          type: "error",
          message: "Please connect wallet",
        }),
      );
      return;
    }
    setOpenRemoveLinkModal(false);
    dispatch(
      removeLink(type, index, linkIndex, account.address, account.extension),
    );
  };

  const isAdminQuery = useIsAdminQuery();
  const isAdmin =
    account?.address === owner ||
    isAdminQuery ||
    isSameAddress(
      account?.address,
      "5GnNHt39B9te5yvhv5qF494u6FF24Ld6MxEGFP4UanGJyag8",
    );

  if (isAdmin || (links && links.length > 0)) {
    return (
      <Wrapper>
        <Table unstackable>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>
                Related Links
                {isAdmin && (
                  <IconButton
                    name="plus"
                    onClick={() => setOpenAddLinkModal(true)}
                  />
                )}
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {links.map((link, linkIndex) => (
              <LinkItem
                key={linkIndex}
                text={link.description}
                link={link.link}
                button={
                  <LinkWrapper>
                    {isAdmin && (
                      <IconButton
                        name="minus"
                        onClick={() => {
                          setLinkIndex(linkIndex);
                          setOpenRemoveLinkModal(true);
                        }}
                      />
                    )}
                  </LinkWrapper>
                }
              />
            ))}
          </Table.Body>
        </Table>
        <Modal
          size="small"
          open={openAddLinkModal}
          onClose={() => setOpenAddLinkModal(false)}
        >
          <Modal.Header>Add Link</Modal.Header>
          <Modal.Content>
            <Form>
              <Form.Input
                fluid
                label="Link"
                placeholder="https://"
                onChange={(_, { value }) => setLink(value)}
              />
              <Form.Input
                fluid
                label="Description"
                placeholder="The description of the link"
                onChange={(_, { value }) => setDescription(value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    addRelatedLink(link, description);
                  }
                }}
              />
            </Form>
          </Modal.Content>
          <Modal.Actions>
            <Button onClick={() => setOpenAddLinkModal(false)}>Cancel</Button>
            <Button onClick={() => addRelatedLink(link, description)}>
              OK
            </Button>
          </Modal.Actions>
        </Modal>
        <Modal
          size="mini"
          open={openRemoveLinkModal}
          onClose={() => setOpenRemoveLinkModal(false)}
        >
          <Modal.Header>Remove Link</Modal.Header>
          <Modal.Content>Are you sure want to remove this link?</Modal.Content>
          <Modal.Actions>
            <Button onClick={() => setOpenRemoveLinkModal(false)}>
              Cancel
            </Button>
            <Button onClick={() => removeRelatedLink(linkIndex)}>OK</Button>
          </Modal.Actions>
        </Modal>
        <DividerWrapper />
      </Wrapper>
    );
  } else {
    return null;
  }
};

export default RelatedLinks;

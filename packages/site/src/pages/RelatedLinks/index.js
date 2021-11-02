import React, { useState } from "react";
import useDeepCompareEffect from "use-deep-compare-effect";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { Button, Icon, Modal, Form } from "semantic-ui-react";
import queryString from "query-string";
import { useLocation } from "react-router-dom";

import LinkItem from "../../components/LinkItem";
import {
  setLinks,
  fetchLinks,
  linksSelector,
  addLink,
  removeLink,
} from "../../store/reducers/linkSlice";
import { nowAddressSelector } from "../../store/reducers/accountSlice";
import { chainSelector } from "../../store/reducers/chainSlice";
import Divider from "../../components/Divider";
import Table from "../../components/Table";

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

const DividerWrapper = styled(Divider)`
  border-top: 1px solid #eeeeee !important;
`;

const RelatedLinks = ({ type, index }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const chain = useSelector(chainSelector);

  useDeepCompareEffect(() => {
    if (index) {
      dispatch(fetchLinks(chain, type, index));
    }
    return () => {
      dispatch(setLinks([]));
    };
  }, [dispatch, chain, type, index]);

  const links = useSelector(linksSelector);
  const nowAddress = useSelector(nowAddressSelector);

  const [openAddLinkModal, setOpenAddLinkModal] = useState(false);
  const [openRemoveLinkModal, setOpenRemoveLinkModal] = useState(false);
  const [link, setLink] = useState("");
  const [description, setDescription] = useState("");
  const [linkIndex, setLinkIndex] = useState(null);

  const addRelatedLink = async (link, description) => {
    setOpenAddLinkModal(false);
    dispatch(addLink(chain, type, index, link, description, nowAddress));
  };

  const removeRelatedLink = async (linkIndex) => {
    setOpenRemoveLinkModal(false);
    dispatch(removeLink(chain, type, index, linkIndex, nowAddress));
  };

  const q = queryString.parse(location.search);
  const isAdmin = q.admin === "true";

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

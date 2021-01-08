import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { Button, Icon, Modal, Form } from "semantic-ui-react";
import queryString from 'query-string';
import { useLocation } from "react-router-dom"

import LinkItem from "./LinkItem";
import SubTitle from "../../components/SubTitle";
import {
  fetchLinks,
  linksSelector,
  addLink,
  removeLink,
} from "../../store/reducers/linkSlice";
import AdminLogin from "../AdminLogin";
import {
  nowAddressSelector,
} from "../../store/reducers/accountSlice";

const Wrapper = styled.div`
  margin-top: 20px;
`;

const LinksWrapper = styled.div`
  margin-top: 16px;
  display: flex;
  gap: 8px;
  flex-direction: column;
`;

const LinkWrapper = styled.div`
  display: flex;
  gap: 8px;
`;

const IconButton = styled(Icon)`
  margin-left: 6px !important;
  cursor: pointer;
`

const RelatedLinks = ({ type, index }) => {
  const dispatch = useDispatch()
  const location = useLocation();

  useEffect(() => {
    dispatch(fetchLinks(type, index));
  }, [dispatch, type, index]);

  const links = useSelector(linksSelector);
  const nowAddress = useSelector(nowAddressSelector);

  const [openAddLinkModal, setOpenAddLinkModal] = useState(false);
  const [openRemoveLinkModal, setOpenRemoveLinkModal] = useState(false);
  const [link, setLink] = useState("");
  const [description, setDescription] = useState("");
  const [linkIndex, setLinkIndex] = useState(null);

  const addRelatedLink = async (link, description) => {
    setOpenAddLinkModal(false);
    dispatch(addLink(type, index, link, description, nowAddress));
  };

  const removeRelatedLink = async (linkIndex) => {
    setOpenRemoveLinkModal(false);
    dispatch(removeLink(type, index, linkIndex, nowAddress));
  };

  const q = queryString.parse(location.search);
  const isAdmin = q.admin === "true";

  return (
    <Wrapper>
      <AdminLogin />

      <SubTitle>Ralated Links
        { isAdmin
            && <IconButton name="plus" onClick={() => setOpenAddLinkModal(true)} />
        }
      </SubTitle>
      <LinksWrapper>
        {
          links.map((link, linkIndex) => <LinkWrapper key={linkIndex}>
            { isAdmin
                && <IconButton name="minus" onClick={() => {
                      setLinkIndex(linkIndex);
                      setOpenRemoveLinkModal(true);
                    }} />
            }
            <LinkItem text={link.description} link={link.link} />
          </LinkWrapper>)
        }
      </LinksWrapper>

      <Modal
        size="small"
        open={openAddLinkModal}
        onClose={() => setOpenAddLinkModal(false)}
      >
        <Modal.Header>Add Link</Modal.Header>
        <Modal.Content>
          <Form>
            <Form.Input fluid label='Link' placeholder='https://'
              onChange={(_, { value }) => setLink(value)}
            />
            <Form.Input fluid label='Description' placeholder='The description of the link'
              onChange={(_, { value }) => setDescription(value)}
            />
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={() => setOpenAddLinkModal(false)}>
            Cancel
          </Button>
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
        <Modal.Content>
          Are you sure want to remove this link?
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={() => setOpenRemoveLinkModal(false)}>
            Cancel
          </Button>
          <Button onClick={() => removeRelatedLink(linkIndex)}>
            OK
          </Button>
        </Modal.Actions>
      </Modal>

    </Wrapper>
  );
};

export default RelatedLinks;

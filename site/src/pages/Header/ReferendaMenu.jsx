import React from "react";
import styled from "styled-components";
import { Label, Menu } from "semantic-ui-react";
import { useSelector } from "react-redux";
import { totalOpenGovApplicationCountSelector } from "../../store/reducers/overviewSlice";
import { ReactComponent as ApplicationSVG } from "./applications.svg";
import { isKusama, isPolkadot } from "../../utils/chains";
import useFetchReferendumCount from "../../hooks/applications/polkadot/useFetchReferendumCount";

const Divider = styled.div`
  position: relative;
  width: 1px;
  height: 20px;
  background-color: var(--neutral300);
  left: 16px;
`;

const Icon = styled(ApplicationSVG)`
  margin-right: 8px;
`;

function CommonReferendaMenu({ count }) {
  return (
    <Menu.Item key="Referenda">
      <Icon /> Applications<Label>{count}</Label>
      <Divider />
    </Menu.Item>
  );
}

function PolkadotReferendaMenu() {
  const { count } = useFetchReferendumCount();
  return <CommonReferendaMenu count={count} />;
}

function ReferendaMenu() {
  const applicationCount = useSelector(totalOpenGovApplicationCountSelector);
  if (isPolkadot || isKusama) {
    return <PolkadotReferendaMenu />;
  }

  return <CommonReferendaMenu count={applicationCount} />;
}

export default ReferendaMenu;

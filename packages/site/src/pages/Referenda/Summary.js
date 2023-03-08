import React, { useEffect, useMemo } from "react";
import styled from "styled-components";

import Text from "../../components/Text";
import TextMinor from "../../components/TextMinor";
import Card from "../../components/Card";
import { fetchApplicationSummary, applicationSummarySelector } from "../../store/reducers/openGovApplicationsSlice";
import { useDispatch, useSelector } from "react-redux";
import { chainSelector } from "../../store/reducers/chainSlice";
import { sumBy } from "../../utils/math";
import { h3_18_semibold, p_12_normal } from "../../styles/text";
import { gap_x, gap_y, grid, grid_cols } from "../../styles/tailwindcss";

const Wrapper = styled(Card)`
  padding: 24px;
  border-radius: 8px;
  margin-bottom: 16px;
  & > div:not(:last-child) {
    margin-right: 16px;
  }
  ${grid};
  ${grid_cols("auto-fit", 161.14)};
  ${gap_x(16)};
  ${gap_y(8)};
`;

const Item = styled.div`
  min-width: 120px;
  &.grow {
    flex-grow: 1;
  }
  &.countdown {
    min-width: 0;
  }
  &.right {
    text-align: right;
  }
  &.available,
  &.next-burn {
    min-width: 160px;
  }
  &.spend-period {
    min-width: 180px;
  }
  & > div:last-child {
    justify-content: flex-end;
  }

  @media screen and (max-width: 1140px) {
    &.grow {
      flex-grow: 0;
    }
    &.countdown {
      display: none;
    }
    &.right {
      text-align: left;
    }
    &.available,
    &.next-burn {
      min-width: 120px;
    }
    &.spend-period {
      min-width: 120px;
    }
    & > div:last-child {
      justify-content: flex-start;
    }
  }
`;

const Title = styled(TextMinor)`
  line-height: 24px;
  ${p_12_normal};
`;

const Value = styled(Text)`
  ${h3_18_semibold};
  span.light {
    color: rgba(0, 0, 0, 0.3);
  }
`;

export default function Summary() {
  const dispatch = useDispatch();
  const chain = useSelector(chainSelector);
  const applicationSummary = useSelector(applicationSummarySelector);

  useEffect(() => {
    dispatch(fetchApplicationSummary(chain));
  }, [dispatch, chain]);

  const activeCount = useMemo(() => {
    const {
      treasurer,
      small_tipper,
      big_tipper,
      small_spender,
      medium_spender,
      big_spender,
    } = applicationSummary ?? {};

    return sumBy(
      [
        treasurer,
        small_tipper,
        big_tipper,
        small_spender,
        medium_spender,
        big_spender,
      ],
      (item) => item?.active || 0
    );
  }, [applicationSummary]);

  return (
    <Wrapper>
      <Item>
        <Title>Ongoing</Title>
        <Value>{activeCount || 0}</Value>
      </Item>
      <Item>
        <Title>Treasurer</Title>
        <Value>{applicationSummary?.treasurer?.active || 0}<span className="light"> / {applicationSummary?.treasurer?.total || 0}</span></Value>
      </Item>
      <Item>
        <Title>Small Tipper</Title>
        <Value>{applicationSummary?.small_tipper?.active || 0}<span className="light"> / {applicationSummary?.small_tipper?.total || 0}</span></Value>
      </Item>
      <Item>
        <Title>Big Tipper</Title>
        <Value>{applicationSummary?.big_tipper?.active || 0}<span className="light"> / {applicationSummary?.big_tipper?.total || 0}</span></Value>
      </Item>
      <Item>
        <Title>Small Spender</Title>
        <Value>{applicationSummary?.small_spender?.active || 0}<span className="light"> / {applicationSummary?.small_spender?.total || 0}</span></Value>
      </Item>
      <Item>
        <Title>Medium Spender</Title>
        <Value>{applicationSummary?.medium_spender?.active || 0}<span className="light"> / {applicationSummary?.medium_spender?.total || 0}</span></Value>
      </Item>
      <Item>
        <Title>Big Spender</Title>
        <Value>{applicationSummary?.big_spender?.active || 0}<span className="light"> / {applicationSummary?.big_spender?.total || 0}</span></Value>
      </Item>
    </Wrapper>
  );
}

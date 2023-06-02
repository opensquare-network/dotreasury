import { useEffect, useState } from "react";
import styled from "styled-components";
import Text from "../../../components/Text";
import { gap } from "../../../styles/tailwindcss";
import Card from "../../../components/Card";
import { h4_16_semibold } from "../../../styles/text";
import Legend from "./Legend";
import Chart from "./Chart";
import { useDispatch, useSelector } from "react-redux";
import { fetchSpendPeriods, spendPeriodsSelector } from "../../../store/reducers/overviewSlice";
import { chainSelector } from "../../../store/reducers/chainSlice";

const Title = styled(Text)`
  margin-bottom: 16px;
  ${h4_16_semibold};
`;

const CardWrapper = styled(Card)`
  padding: 24px;
  @media screen and (max-width: 600px) {
    border-radius: 0;
  }
`;

const ContentWrapper = styled.div`
  display: flex;
  ${gap(24)};
  @media screen and (max-width: 800px) {
    flex-direction: column;
  }
`;

const defaultLegends = [
  {
    label: "Proposal",
    color: "#FC7C91",
    enabled: true,
    getValue: (period) => 1,
  },
  {
    label: "Tips",
    color: "#FCCF75",
    enabled: true,
    getValue: (period) => 1,
  },
  {
    label: "Bounties",
    color: "#928FF2",
    enabled: true,
    getValue: (period) => 1,
  },
  {
    label: "Burnt",
    color: "#FCA97C",
    enabled: false,
    getValue: (period) => 1,
  },
];

export default function SpendPeriod() {
  const dispatch = useDispatch();
  const chain = useSelector(chainSelector);
  const [legends, setLegends] = useState(defaultLegends);
  const spendPeriods = useSelector(spendPeriodsSelector);

  useEffect(() => {
    dispatch(fetchSpendPeriods(chain));
  }, [dispatch, chain]);

  return (
      <CardWrapper>
        <Title>Spend Period</Title>
        <ContentWrapper>
          <Legend legends={legends} setLegends={setLegends} />
          <Chart legends={legends.filter(item => item.enabled)} data={spendPeriods} />
        </ContentWrapper>
      </CardWrapper>
    );
}

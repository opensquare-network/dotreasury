import React, { useEffect } from "react";
import {
  fetchTopBeneficiaries,
  topBeneficiariesSelector,
} from "../../../store/reducers/overviewSlice.js";
import { useDispatch, useSelector } from "react-redux";
import {
  CardWrapper,
  LinkButton,
  TableCell,
  TableRow,
  TableWrapper,
  Title,
  TitleContainer,
} from "../BeneficiaryTable.jsx";
import { NavLink } from "react-router-dom";
import Table from "../../../components/Table";
import TableNoDataCell from "../../../components/TableNoDataCell.jsx";
import User from "../../../components/User/index.jsx";
import { USER_ROLES } from "../../../constants/index.js";
import Balance from "../../../components/Balance.jsx";
import ProposalsCount from "../../../components/ProposalsCount.jsx";
import { ProposalsWrapper } from "../../Users/useUsersTableColumns.jsx";
import { isPolkadot, isKusama } from "../../../utils/chains/index.js";
import ValueDisplay from "../../../components/ValueDisplay.jsx";
import { p_14_medium } from "../../../styles/text.js";
import styled from "styled-components";
import IconMask from "../../../components/Icon/Mask.jsx";

const TotalValueCellWrapper = styled.div`
  ${p_14_medium}
  color: var(--textSecondary);
  white-space: nowrap;
`;

export default function TopBeneficiariesTable() {
  const dispatch = useDispatch();
  const topBeneficiaries = useSelector(topBeneficiariesSelector);

  useEffect(() => {
    dispatch(fetchTopBeneficiaries());
  }, [dispatch]);

  return (
    <CardWrapper>
      <TitleContainer>
        <Title>Top Beneficiaries</Title>
        <NavLink to={"/beneficiaries"}>
          <LinkButton>
            View All
            <IconMask
              src="/imgs/caret-right.svg"
              size={24}
              color="textSecondary"
            />
          </LinkButton>
        </NavLink>
      </TitleContainer>

      <TableWrapper>
        <Table unstackable>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell width={3}>Beneficiary</Table.HeaderCell>
              <Table.HeaderCell textAlign={"right"} width={4}>
                Proposals
              </Table.HeaderCell>
              <Table.HeaderCell textAlign={"right"} width={5}>
                Total value
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {topBeneficiaries && topBeneficiaries.length <= 0 ? (
              <TableNoDataCell />
            ) : (
              topBeneficiaries.slice(0, 10).map((item, index) => {
                return (
                  <TableRow key={index}>
                    <Table.Cell>
                      <NavLink to={`/beneficiaries/${item.address}`}>
                        <User
                          role={USER_ROLES.Beneficiary}
                          address={item.address}
                          noLink
                        />
                      </NavLink>
                    </Table.Cell>
                    <TableCell textAlign={"right"}>
                      <ProposalsWrapper>
                        <ProposalsCount
                          spends={item?.spends?.benefitCount}
                          proposals={item?.proposals?.benefitCount}
                          bounties={item?.bounties?.benefitCount}
                          childBounties={item?.childBounties?.benefitCount}
                          tips={item?.tips?.benefitCount}
                        />
                      </ProposalsWrapper>
                    </TableCell>

                    <TableCell textAlign={"right"}>
                      {isPolkadot || isKusama ? (
                        <TotalValueCellWrapper>
                          <ValueDisplay
                            value={item.totalBenefitFiatValue}
                            prefix="$"
                            abbreviate={false}
                          />
                        </TotalValueCellWrapper>
                      ) : (
                        <Balance
                          value={item.totalValue.totalBenefit}
                          usdt={item.totalFiatValue.totalBenefit}
                          reverse
                          isUnitPrice={false}
                        />
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </Table.Body>
        </Table>
      </TableWrapper>
    </CardWrapper>
  );
}

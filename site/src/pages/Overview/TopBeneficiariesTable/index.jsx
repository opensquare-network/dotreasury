import React, { useEffect } from "react";
import {
  fetchTopBeneficiaries,
  overviewSelector,
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
import GrayImage from "../../../components/GrayImage.jsx";
import Table from "../../../components/Table";
import TableNoDataCell from "../../../components/TableNoDataCell.jsx";
import User from "../../../components/User/index.jsx";
import { USER_ROLES } from "../../../constants/index.js";
import Balance from "../../../components/Balance.jsx";
import ProposalsCount from "../../../components/ProposalsCount.jsx";
import { ProposalsWrapper } from "../../Users/useUsersTableColumns.jsx";

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
        <NavLink to={"/users?role=beneficiary"}>
          <LinkButton>
            View All
            <GrayImage src="/imgs/caret-right.svg" width={24} />
          </LinkButton>
        </NavLink>
      </TitleContainer>

      <TableWrapper>
        <Table unstackable>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Beneficiary</Table.HeaderCell>
              <Table.HeaderCell textAlign={"right"}>
                Total value
              </Table.HeaderCell>
              <Table.HeaderCell textAlign={"right"}>Proposals</Table.HeaderCell>
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
                      <User
                        role={USER_ROLES.Beneficiary}
                        address={item.address}
                      />
                    </Table.Cell>
                    <TableCell textAlign={"right"}>
                      <Balance
                        value={item.totalValue.totalBenefit}
                        usdt={item.totalFiatValue.totalBenefit}
                        reverse
                        isUnitPrice={false}
                      />
                    </TableCell>

                    <TableCell textAlign={"right"}>
                      <ProposalsWrapper>
                        <ProposalsCount
                          proposals={item?.proposals?.benefitCount}
                          bounties={item?.bounties?.benefitCount}
                          childBounties={item?.childBounties?.benefitCount}
                          tips={item?.tips?.benefitCount}
                        />
                      </ProposalsWrapper>
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

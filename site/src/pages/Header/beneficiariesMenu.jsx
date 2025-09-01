import { useSelector } from "react-redux";
import { Label, Menu } from "semantic-ui-react";
import { beneficiariesSelector } from "../../store/reducers/beneficiariesSlice";
import useEnsureBenificiariesCount from "../BeneficiariesDetail/useEnsureBenificiariesCount";

export default function BeneficiariesMenu() {
  useEnsureBenificiariesCount();
  const beneficiaries = useSelector(beneficiariesSelector);

  return (
    <Menu.Item key="Beneficiaries">
      Beneficiaries<Label>{beneficiaries?.total ?? 0}</Label>
    </Menu.Item>
  );
}

import { useSelector } from "react-redux";
import { Label, Menu } from "semantic-ui-react";
import { beneficiariesSelector } from "../../store/reducers/beneficiariesSlice";

export default function BeneficiariesMenu() {
  const beneficiaries = useSelector(beneficiariesSelector);

  return (
    <Menu.Item key="Beneficiaries">
      Beneficiaries<Label>{beneficiaries?.total ?? 0}</Label>
    </Menu.Item>
  );
}

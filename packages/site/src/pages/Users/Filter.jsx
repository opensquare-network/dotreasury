import React from "react";
import styled from "styled-components";
import { Form } from "semantic-ui-react";

import Select from "../../components/Select";

const FormWrapper = styled(Form)`
  display: flex;
  gap: 16px;
  flex-grow: 1;
  align-items: center;

  @media screen and (max-width: 800px) {
    flex-direction: column;
  }

  & .field {
    margin: 0 !important;
  }

  .ui.dropdown .text {
    font-size: 12px !important;
  }
`;

const RoleSelect = styled(Select)`
  width: 145px;
  @media screen and (max-width: 800px) {
    width: 100%;
  }
`;

const Filter = ({
  role,
  setRole,
}) => {

  const roleOptions = [
    { key: "all", value: "-1", text: "All roles" },
    ...[
      "Proposer",
      "Councilor",
      "Beneficiary",
    ].map((key) => ({
      key,
      value: key.toLowerCase(),
      text: key,
    })),
  ];

  return (
    <FormWrapper>
      <RoleSelect
        name="role"
        fluid
        options={roleOptions}
        value={role}
        onChange={(e, { name, value }) => setRole(value)}
      />
    </FormWrapper>
  );
};

export default Filter;

import styled from "styled-components";
import { Form } from "semantic-ui-react";

const CustomSelect = styled(Form.Select)`
  .ui.selection.dropdown {
    border-color: #dddddd;
    border-radius: 4px;
    padding: 3px 29px 3px 8px !important;
    min-height: 24px !important;
    &:focus {
      border-color: #dddddd;
    }
  }
  .dropdown.icon {
    padding: 4px 12px !important;
  }
  .dropdown.icon:before {
    color: rgba(29, 37, 60, 0.24);
    font-size: 13px;
  }
  .ui.selection.dropdown .menu > .item {
    padding: 0 !important;
    padding-left: 16px !important;
    height: 24px;
    line-height: 24px;
  }
  .ui.dropdown.active > .dropdown.icon:before {
    color: rgba(29, 37, 60, 0.64);
  }
  .ui.selection.dropdown {
    padding-left: 16px !important;
  }
  .ui.selection.active.dropdown,
  .ui.selection.active.dropdown .menu {
    border-color: #dddddd;
  }
  .ui.selection.dropdown:focus .menu {
    border-color: #dddddd !important;
  }
`;

export default CustomSelect;

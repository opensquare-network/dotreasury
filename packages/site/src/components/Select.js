import styled from "styled-components";
import { Form } from "semantic-ui-react";
import { bg_transparent } from "../styles/tailwindcss";

const CustomSelect = styled(Form.Select)`
  .ui.selection.dropdown {
    border-color: var(--neutral400);
    ${bg_transparent};
    border-radius: 4px;
    padding: 3px 29px 3px 8px !important;
    min-height: 24px !important;
    &:focus {
      border-color: var(--neutral400);
    }
  }
  .text {
    color: var(--textPrimaryContrast) !important;
  }
  .dropdown.icon {
    padding: 4px 12px !important;
  }
  .dropdown.icon:before {
    color: var(--textTertiary);
    font-size: 13px;
  }
  .ui.selection.dropdown .menu > .item {
    padding: 0 !important;
    padding-left: 16px !important;
    height: 24px;
    line-height: 24px;
  }
  .ui.dropdown.active > .dropdown.icon:before {
    color: var(--textSecondary);
  }
  .ui.selection.dropdown {
    padding-left: 16px !important;
  }
  .ui.selection.active.dropdown,
  .ui.selection.active.dropdown .menu {
    border-color: var(--neutral400);
  }
  .ui.selection.dropdown:focus .menu {
    border-color: var(--neutral400) !important;
  }

  .ui.selection.dropdown.active {
    .visible.menu {
      background-color: var(--neutral100) !important;

      & .item {
        border-color: var(--neutral300);

        &:hover {
          background-color: var(--neutral300) !important;
        }

        &.selected {
          background-color: var(--neutral300) !important;
        }
      }
    }
  }
`;

export default CustomSelect;

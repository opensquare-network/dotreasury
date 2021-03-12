import styled from "styled-components";
import { Form } from 'semantic-ui-react'

const CustomSelect = styled(Form.Select)`
  .ui.selection.dropdown{
    border-radius: 8px;
  }
  .dropdown.icon:before{
    color: rgba(29, 37, 60, 0.24);
    font-size: 13px;
  }
  .ui.selection.dropdown .menu>.item{
    padding: 0!important;
    padding-left: 16px!important;
    height: 40px;
    line-height: 40px;
  }
  .ui.dropdown.active>.dropdown.icon:before{
    color: rgba(29, 37, 60, 0.64);
  }
  .ui.selection.dropdown{
    padding-left: 16px!important;
  }
  .ui.selection.active.dropdown, .ui.selection.active.dropdown .menu{
    border-color: #e1e1e1;
  }
`

export default CustomSelect;

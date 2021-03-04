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
`

export default CustomSelect;

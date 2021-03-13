import React from 'react'
import styled from 'styled-components'
import { Popup } from 'semantic-ui-react'

import TextMinor from '../TextMinor'
import { TEXT_DARK_MAJOR } from '../../constants'
import { useDisablePopup } from '../../utils/hooks'

const TextUsername = styled(TextMinor)`
  white-space: nowrap;
  cursor: pointer;
  flex-grow: 1;
  &:hover {
    color: ${TEXT_DARK_MAJOR};
    text-decoration-line: underline;
  }
`

const Username = ({ address, name, ellipsis, popup }) => {
  const disabledPopup = useDisablePopup()
  let displayAddress
  if (typeof address === 'string') {
    if (ellipsis) {
      displayAddress = `${address.substring(0, 6)}...${address.substring(
        address.length - 6,
        address.length
      )}`
    } else {
      displayAddress = address
    }
  } else if (typeof address === 'object') {
    if (ellipsis) {
      displayAddress = `${address.id.substring(0, 6)}...${address.id.substring(
        address.id.length - 6,
        address.id.length
      )}`
    } else {
      displayAddress = address.id
    }
  }

  const displayName = name ? name : displayAddress
  return (
    <Popup
      content={name ? `${name} ${address}` : address}
      size="mini"
      disabled={!popup || disabledPopup}
      trigger={<TextUsername>{displayName}</TextUsername>}
    />
  )
}

export default Username

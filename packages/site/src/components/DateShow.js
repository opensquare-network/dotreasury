import React, { memo } from 'react'
import dayjs from 'dayjs'

export default memo(function DateShow(props) {
  const { value, className, style, format = 'YYYY-MM-DD HH:mm:ss' } = props

  const nValue = parseInt(value);

  return (
    <span className={className} style={style}>
      {nValue ? dayjs(nValue).format(format) : ""}
    </span>
  )
})

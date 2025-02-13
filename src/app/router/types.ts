import { type JSX } from 'react'

import { type VideoCameraOutlined } from '@ant-design/icons'

export interface IRoute {
  path: string
  Component: JSX.Element
}

export interface ITab {
  text: string
  path: string
  icon?: typeof VideoCameraOutlined
}

import { VideoCameraOutlined } from '@ant-design/icons'

export type TRole = 'Admin' | 'none' | 'empty'

export interface ITab {
  text: string
  path: string
  icon?: typeof VideoCameraOutlined
}

export interface IModal {
  onClose?(): void
  component: JSX.Element
}

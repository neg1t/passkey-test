import { combine, createStore } from 'effector'
import { ITab } from 'shared/types/entities'

import { FireOutlined } from '@ant-design/icons'

export const $allTabs = createStore<ITab[]>([
  {
    path: '/main',
    text: 'Главная',
    icon: FireOutlined,
  },
  {
    path: '/another',
    text: 'Другая',
    icon: FireOutlined,
  },
])

// фильтруем табы здесь если нужно
export const $pageHeaderTabs = combine<ITab[], ITab[]>($allTabs, (tabs) => tabs)

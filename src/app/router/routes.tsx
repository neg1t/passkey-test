import { FireOutlined } from '@ant-design/icons'
import { combine, createStore } from 'effector'

import { MainPage } from 'pages/Main'
import { Profile } from 'pages/Profile'

import type { IRoute, ITab } from './types'

export const $routes = createStore<IRoute[]>([
  {
    path: '/main',
    Component: <MainPage />,
  },
  {
    path: '/profile',
    Component: <Profile />,
  },
])

export const $allTabs = createStore<ITab[]>([
  {
    path: '/main',
    text: 'Главная',
    icon: FireOutlined,
  },
  {
    path: '/profile',
    text: 'Профиль',
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

// фильтруем роуты если нужно
export const $availableRoutes = combine<IRoute[], IRoute[]>(
  $routes,
  (routes) => {
    return routes
  },
)

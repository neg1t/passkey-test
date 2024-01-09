import { combine, createStore } from 'effector'
import { MainPage } from 'pages/Main'
import type { IRoute } from 'shared/types/pages'

export const $routes = createStore<IRoute[]>([
  {
    path: '/main',
    Component: <MainPage />,
  },
])

// фильтруем роуты если нужно
export const $availableRoutes = combine<IRoute[], IRoute[]>(
  $routes,
  (routes) => {
    return routes
  },
)

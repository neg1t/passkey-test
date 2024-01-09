import type { ThemeConfig } from 'antd'

const token: ThemeConfig['token'] = {
  colorPrimary: '#ff7052',
  colorInfo: '#361766',
}

const components: ThemeConfig['components'] = {
  Menu: {
    itemSelectedColor: '#d9503b',
  },
}

export const themeConfig: ThemeConfig = {
  token,
  components,
}

import type { ThemeConfig } from 'antd'

const token: ThemeConfig['token'] = {
  colorPrimary: '#ff7052',
  colorInfo: '#361766',
}

const components: ThemeConfig['components'] = {
  Menu: {
    itemSelectedColor: '#d9503b',
  },
  Typography: {
    titleMarginBottom: 0,
  },
}

export const themeConfig: ThemeConfig = {
  token,
  components,
}

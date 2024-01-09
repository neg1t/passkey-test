import React from 'react'
import { BrowserRouter } from 'react-router-dom'

import { AppContainer } from './AppContainer'
import { ToastContainer } from 'react-toastify'
import { ConfigProvider } from 'antd'
import { themeConfig } from 'shared/config/theme'

export const App = () => {
  return (
    <ConfigProvider theme={themeConfig}>
      <BrowserRouter>
        <AppContainer />
        <ToastContainer />
      </BrowserRouter>
    </ConfigProvider>
  )
}

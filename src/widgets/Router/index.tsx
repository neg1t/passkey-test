import React, { useEffect, useState } from 'react'
import { useUnit } from 'effector-react'
import { CSSTransition } from 'react-transition-group'
import {
  Link,
  Route,
  Routes,
  Navigate,
  useLocation,
  useNavigate,
} from 'react-router-dom'
import type { MenuProps } from 'antd'
import { Layout, Menu, theme } from 'antd'

import { menuModel } from 'entities/menu'
import { userRoleModel } from 'entities/role'
import { $availableRoutes } from './model/routes'
import logo from 'shared/assets/logo.png'
import { PageLoader } from 'shared/ui/PageLoader'

const { Header, Content, Footer, Sider } = Layout

// если индекс будет 0 не будет корректно работать
function getTabKey(key: number): React.Key {
  return key + 1
}

type MenuItem = Required<MenuProps>['items'][number] & { path: string }

export const Router = () => {
  const [collapsed, setCollapsed] = useState(false)

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken()

  const location = useLocation()
  const navigate = useNavigate()
  const role = useUnit(userRoleModel.stores.$role)
  const routes = useUnit($availableRoutes)

  const tabs: MenuItem[] = useUnit(menuModel.$pageHeaderTabs).map(
    (tab, index) => ({
      path: tab.path,
      key: getTabKey(index),
      icon: tab?.icon && React.createElement(tab.icon),
      title: tab.text,
      label: <Link to={tab.path}>{tab.text}</Link>,
    }),
  )

  useEffect(() => {
    if (location.pathname !== '/') {
      localStorage.setItem('pathToRedirect', location.pathname)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const pathToRedirect = localStorage.getItem('pathToRedirect')
    if (pathToRedirect) {
      navigate(pathToRedirect)
      setTimeout(() => {
        localStorage.removeItem('pathToRedirect')
      }, 1000)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const selectedKey = getTabKey(
    tabs.findIndex((tab) => tab.path === location.pathname),
  )

  return (
    <>
      <CSSTransition
        // in={!role}
        timeout={500}
        classNames='modal-transition'
        unmountOnExit
      >
        <PageLoader logo={<img src={logo} alt='Logo' />} />
      </CSSTransition>
      <Layout style={{ minHeight: '100vh' }}>
        <Sider
          theme='light'
          collapsible
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
        >
          <div className='demo-logo-vertical' />
          <Menu
            onClick={(item) => console.log(item)}
            defaultSelectedKeys={['1']}
            mode='inline'
            items={tabs}
            selectedKeys={[selectedKey.toString()]}
          />
        </Sider>
        <Layout>
          <Header style={{ padding: 0, background: colorBgContainer }} />
          <Content style={{ margin: '20px 16px 0px 16px' }}>
            <article
              style={{
                padding: 24,
                minHeight: 360,
                background: colorBgContainer,
                borderRadius: borderRadiusLG,
              }}
            >
              <Routes>
                {routes.map(({ path, Component }) => (
                  <Route key={path} path={path} element={Component} />
                ))}

                {!!routes.length && (
                  <Route
                    path='*'
                    element={<Navigate to={routes[0].path} replace />}
                  />
                )}
              </Routes>
            </article>
          </Content>
          <Footer style={{ textAlign: 'center', padding: 10 }}>
            Версия: {import.meta.env.VITE_VERSION}
          </Footer>
        </Layout>
      </Layout>
    </>
  )
}

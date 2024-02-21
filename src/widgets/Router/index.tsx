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
import { Avatar, Button, Dropdown, Layout, Menu, theme } from 'antd'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
} from '@ant-design/icons'
import logo from 'shared/assets/logo.png'

import { menuModel } from 'entities/menu'
import { $availableRoutes } from './model/routes'
import { PageLoader } from 'shared/ui/PageLoader'
import { tokenModel } from 'entities/token'
import './styles.scss'

const { Header, Content, Footer, Sider } = Layout

// если индекс будет 0 не будет корректно работать
function getTabKey(key: number): React.Key {
  return key + 1
}

type MenuItem = Required<MenuProps>['items'][number] & { path: string }

export const Router = () => {
  const [collapsed, setCollapsed] = useState(false)

  const {
    token: { colorBgContainer, borderRadiusLG, paddingLG },
  } = theme.useToken()

  const location = useLocation()
  const navigate = useNavigate()
  const routes = useUnit($availableRoutes)
  const token = useUnit(tokenModel.stores.$tokenData)

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

  const avatarMenu: MenuProps['items'] = [
    {
      key: '1',
      onClick: () => {},
      label: (
        <span>
          <UserOutlined /> Аккаунт
        </span>
      ),
    },
    {
      key: '2',
      onClick: () => {},
      label: <span>Выйти</span>,
    },
  ]

  return (
    <>
      <CSSTransition
        in={!token}
        timeout={500}
        classNames='modal-transition'
        unmountOnExit
      >
        <PageLoader logo={<img src={logo} alt='Logo' />} />
      </CSSTransition>
      <Layout className='layout' style={{ minHeight: '100vh' }}>
        <Sider theme='light' collapsible collapsed={collapsed} trigger={null}>
          <div className='slider-logo'>
            <img src={logo} alt='Лого' />
          </div>
          <Menu
            defaultSelectedKeys={['1']}
            mode='inline'
            items={tabs}
            selectedKeys={[selectedKey.toString()]}
          />
        </Sider>

        <Layout>
          <Header
            className='layout__header'
            style={{
              background: colorBgContainer,
            }}
          >
            <Button
              type='text'
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                width: 64,
                height: 64,
              }}
            />

            <Dropdown
              placement='bottomRight'
              arrow
              overlayClassName='avatar-dropdown-overlay'
              menu={{ items: avatarMenu }}
            >
              <Avatar className='header-avatar'>??</Avatar>
            </Dropdown>
          </Header>

          <Content
            className='layout__content'
            style={{
              padding: paddingLG,
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
          </Content>

          <Footer
            className='layout__footer'
            style={{
              background: colorBgContainer,
            }}
          >
            <span>Версия {import.meta.env.VITE_VERSION}</span>
            <span>© 2024 Company. All right reserved.</span>
          </Footer>
        </Layout>
      </Layout>
    </>
  )
}

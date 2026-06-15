import React, { useState } from 'react'

import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
} from '@ant-design/icons'
import {
  Avatar,
  Button,
  Dropdown,
  Layout,
  Menu,
  type MenuProps,
  theme,
} from 'antd'
import { CSSTransition } from 'react-transition-group'

import { logout } from 'entities/auth/model'

import logo from 'shared/assets/logo.png'
import { PageLoader } from 'shared/ui/PageLoader'

import './styles.scss'

const { Header, Content, Footer, Sider } = Layout

export function getTabKey(key: number): React.Key {
  return key + 1
}

type MenuItem = Required<MenuProps>['items'][number] & { path: string }
type MainLayoutProps = {
  menuItems: MenuItem[]
  isLoading: boolean
}
export function MainLayout({
  children,
  isLoading,
  menuItems,
}: React.PropsWithChildren<MainLayoutProps>) {
  const [collapsed, setCollapsed] = useState(false)
  const {
    token: { colorBgContainer, borderRadiusLG, paddingLG },
  } = theme.useToken()

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
      label: <span onClick={logout}>Выйти</span>,
    },
  ]

  const selectedKey = getTabKey(
    menuItems.findIndex((tab) => tab.path === location.pathname),
  )
  return (
    <>
      <CSSTransition
        in={isLoading}
        timeout={500}
        classNames="modal-transition"
        unmountOnExit
      >
        <PageLoader logo={<img src={logo} alt="Logo" />} />
      </CSSTransition>
      <Layout className="layout" style={{ minHeight: '100vh' }}>
        <Sider theme="light" collapsible collapsed={collapsed} trigger={null}>
          <div className="slider-logo">
            <img src={logo} alt="Лого" />
          </div>
          <Menu
            defaultSelectedKeys={['1']}
            mode="inline"
            items={menuItems}
            selectedKeys={[selectedKey.toString()]}
          />
        </Sider>

        <Layout>
          <Header
            className="layout__header"
            style={{
              background: colorBgContainer,
            }}
          >
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                width: 64,
                height: 64,
              }}
            />

            <Dropdown
              placement="bottomRight"
              arrow
              classNames={{ root: 'avatar-dropdown-overlay' }}
              menu={{ items: avatarMenu }}
            >
              <Avatar className="header-avatar">??</Avatar>
            </Dropdown>
          </Header>

          <Content
            className="layout__content"
            style={{
              padding: paddingLG,
              borderRadius: borderRadiusLG,
            }}
          >
            {children}
          </Content>

          <Footer
            className="layout__footer"
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

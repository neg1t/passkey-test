import React from 'react'

import type { MenuProps } from 'antd'
import { useUnit } from 'effector-react'
import { Link, Navigate, Route, Routes } from 'react-router-dom'

import { stores } from 'entities/auth'

import { MainLayout, getTabKey } from '../layouts'
import { $availableRoutes, $pageHeaderTabs } from './routes'

type MenuItem = Required<MenuProps>['items'][number] & { path: string }

export const Router = () => {
  const routes = useUnit($availableRoutes)
  const token = useUnit(stores.$tokenData)

  const tabs: MenuItem[] = useUnit($pageHeaderTabs).map((tab, index) => ({
    path: tab.path,
    key: getTabKey(index),
    icon: tab?.icon && React.createElement(tab.icon),
    title: tab.text,
    label: <Link to={tab.path}>{tab.text}</Link>,
  }))

  return (
    <MainLayout menuItems={tabs} isLoading={!token}>
      <Routes>
        {routes.map(({ path, Component }) => (
          <Route key={path} path={path} element={Component} />
        ))}

        {!!routes.length && (
          <Route path="*" element={<Navigate to={routes[0].path} replace />} />
        )}
      </Routes>
    </MainLayout>
  )
}

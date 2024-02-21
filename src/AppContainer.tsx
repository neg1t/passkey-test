import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ErrorBoundary } from 'shared/utils/ErrorBoundary'
import { Router } from 'widgets/Router'

export const AppContainer: React.FC = () => {
  const navigate = useNavigate()

  const onGoBackHandler = () => {
    navigate('/')

    setTimeout(() => {
      window.location.reload()
    }, 300)
  }

  return (
    <ErrorBoundary onGoBack={onGoBackHandler}>
      <Router />
    </ErrorBoundary>
  )
}

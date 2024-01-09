export const API_ROOT = import.meta.env.VITE_API_ROOT

export const identityServer = import.meta.env.VITE_OAUTH_ROOT

export const clientId = import.meta.env.VITE_OAUTH_CLIENT_ID
export const redirectUri = import.meta.env.VITE_OAUTH_REDIRECT_URI
export const nodeEnv = import.meta.env.VITE_REACT_NODE_ENV

export const scopes = [
  'openid',
  'profile',
  'email',
  'SF.CRM.Api.Backend.Scope',
  'roles',
]

import {
  attach,
  combine,
  createEffect,
  createEvent,
  createStore,
  sample,
  scopeBind,
} from 'effector'
import { jwtDecode } from 'jwt-decode'
import type { User, UserManager } from 'oidc-client-ts'

import { $accessToken, apiApiRequestError } from 'shared/api'
import { AuthError } from 'shared/api'
import {
  AUTH_NGROK_SKIP_BROWSER_WARNING,
  AUTH_URL,
  CLIENT_ID,
  REDIRECT_URI,
  SCOPE,
} from 'shared/config'

import { hasRegisteredPasskey } from '../lib/keycloak-account'
import { createUserManager } from '../lib/user-manager'

export interface ITokenData {
  nbf: number
  exp: number
  iss: string
  name: string
  aud: string[]
  client_id: string
  sub: string
  auth_time: number
  idp: 'local'
  scope: string[]
}

export type PasskeyRegistrationStatus =
  | 'unknown'
  | 'loading'
  | 'registered'
  | 'notRegistered'
  | 'unavailable'

const PASSKEY_REGISTRATION_ACTION =
  'webauthn-register-passwordless:skip_if_exists'
const PASSKEY_PROMPT_STORAGE_PREFIX = 'passkeyPromptDismissed'

function getPasskeyPromptStorageKey(tokenData: ITokenData | null) {
  if (tokenData === null) return null

  return `${PASSKEY_PROMPT_STORAGE_PREFIX}:${tokenData.iss}:${tokenData.sub}`
}

export const logout = createEvent()
export const userReceived = createEvent<User>()
export const passkeyPromptDismissed = createEvent()
const passkeyCredentialsCheckStarted = createEvent<string>()
export const registerPasskey = createEvent()
const silentUpdateError = createEvent<Error>()

const $manager = createStore<UserManager>(
  createUserManager({
    authority: AUTH_URL,
    clientId: CLIENT_ID,
    redirectUri: REDIRECT_URI,
    scope: SCOPE,
    skipNgrokBrowserWarning: AUTH_NGROK_SKIP_BROWSER_WARNING,
  }),
)

export const $tokenData = $accessToken.map((x) => x)

export const $decodedToken = $accessToken.map((token) => {
  if (token === null) return null as ITokenData | null

  try {
    return jwtDecode<ITokenData>(token)
  } catch (error) {
    console.error('Failed to decode token', error)
    return null
  }
})

export const fetchPasskeyCredentialsFx = createEffect((accessToken: string) =>
  hasRegisteredPasskey({
    accessToken,
    authority: AUTH_URL,
  }),
)

const checkPasskeyPromptDismissedFx = createEffect(
  (tokenData: ITokenData | null) => {
    const storageKey = getPasskeyPromptStorageKey(tokenData)
    if (storageKey === null) return true

    return sessionStorage.getItem(storageKey) === 'true'
  },
)

const dismissPasskeyPromptFx = createEffect((tokenData: ITokenData | null) => {
  const storageKey = getPasskeyPromptStorageKey(tokenData)
  if (storageKey !== null) {
    sessionStorage.setItem(storageKey, 'true')
  }
})

const registerPasskeyFx = attach({
  source: $manager,
  effect: (manager) =>
    manager.signinRedirect({
      extraQueryParams: {
        kc_action: PASSKEY_REGISTRATION_ACTION,
      },
    }),
})

const schedulePasskeyCredentialsCheckFx = createEffect(
  (accessToken: string) => {
    const passkeyCredentialsCheckStartedScope = scopeBind(
      passkeyCredentialsCheckStarted,
    )

    window.setTimeout(() => passkeyCredentialsCheckStartedScope(accessToken), 0)
  },
)

export const $passkeyRegistrationStatus =
  createStore<PasskeyRegistrationStatus>('unknown')
    .on(fetchPasskeyCredentialsFx, () => 'loading')
    .on(fetchPasskeyCredentialsFx.doneData, (_, hasPasskey) =>
      hasPasskey ? 'registered' : 'notRegistered',
    )
    .on(fetchPasskeyCredentialsFx.failData, () => 'unavailable')
    .reset(logout)

const $passkeyPromptDismissed = createStore(true)
  .on(checkPasskeyPromptDismissedFx.doneData, (_, isDismissed) => isDismissed)
  .on(passkeyPromptDismissed, () => true)
  .on(registerPasskey, () => true)
  .reset(logout)

export const $passkeyPromptVisible = combine(
  $passkeyRegistrationStatus,
  $passkeyPromptDismissed,
  (status, isDismissed) => status === 'notRegistered' && !isDismissed,
)

export const initUserManagerFx = attach({
  source: $manager,
  effect: (manager) => {
    const userReceivedScope = scopeBind(userReceived)
    const silentUpdateErrorScope = scopeBind(silentUpdateError)
    manager.events.addUserLoaded((user) => userReceivedScope(user))
    manager.events.addSilentRenewError((error) => silentUpdateErrorScope(error))
  },
})

export const aquireUser = attach({
  source: $manager,
  effect: async (manager, search: string) => {
    let data: User | null = null

    if (search !== '') {
      data = await manager.signinRedirectCallback(search)
    }

    if (data === null) {
      data = await manager.getUser()
    }

    if (data === null) throw new Error('Failed to load user')
    return data
  },
})

const signoutUser = attach({
  source: $manager,
  effect: async (manager) => {
    await manager.signoutRedirect({
      post_logout_redirect_uri: REDIRECT_URI,
      redirectMethod: 'replace',
    })
    return manager.clearStaleState()
  },
})

const requestUser = attach({
  source: $manager,
  effect: (manager) => manager?.signinRedirect(),
})

sample({
  clock: [aquireUser.failData, silentUpdateError],
  target: requestUser,
})

sample({
  clock: [aquireUser.doneData, userReceived],
  fn: (user) => user.access_token,
  target: $accessToken,
})

sample({
  clock: [aquireUser.doneData, userReceived],
  fn: (user) => user.access_token,
  target: schedulePasskeyCredentialsCheckFx,
})

sample({
  clock: passkeyCredentialsCheckStarted,
  target: fetchPasskeyCredentialsFx,
})

sample({
  clock: $decodedToken,
  target: checkPasskeyPromptDismissedFx,
})

sample({
  clock: passkeyPromptDismissed,
  source: $decodedToken,
  target: dismissPasskeyPromptFx,
})

sample({
  clock: registerPasskey,
  source: $decodedToken,
  target: dismissPasskeyPromptFx,
})

sample({
  clock: registerPasskey,
  target: registerPasskeyFx,
})

sample({
  clock: logout,
  target: signoutUser,
})

sample({
  clock: apiApiRequestError,
  source: $accessToken,
  filter: (accessToken, error) =>
    error instanceof AuthError &&
    accessToken !== null &&
    accessToken.length > 0,
  target: logout,
})

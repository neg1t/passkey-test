import { UserManager, User } from 'oidc-client-ts'
import { createEffect, createEvent, sample } from 'effector'
import { AUTH_URL, CLIENT_ID, REDIRECT_URI, SCOPE } from 'shared/config/const'

export const aquireUser = createEffect<string, User>()
export const signoutUser = createEffect<void, void>()
export const requestUser = createEffect<void, void>()
export const userReceived = createEvent<User>()

export const effects = {
  aquireUser,
  signoutUser,
  requestUser,
}

export const events = {
  userReceived,
}

const manager = new UserManager({
  authority: AUTH_URL,

  client_id: CLIENT_ID,
  redirect_uri: REDIRECT_URI,

  // response_type: 'code',
  scope: SCOPE,
  accessTokenExpiringNotificationTimeInSeconds: 30,

  // accessTokenExpiringNotificationTime: 30,

  automaticSilentRenew: true,

  monitorSession: false,
})

requestUser.use(async () => {
  manager.signinRedirect()
})

signoutUser.use(() => {
  manager.signoutRedirect({
    post_logout_redirect_uri: REDIRECT_URI,
    redirectMethod: 'replace',
  })
  manager.clearStaleState()
})

aquireUser.use(async (search) => {
  let data = await manager.getUser()

  if (data == null && search !== '') {
    data = await manager.signinRedirectCallback(search)
  }

  if (data !== null) {
    return data
  }

  throw new Error('Failed to load user')
})

sample({
  clock: aquireUser.failData,
  target: requestUser,
})

manager.events.addUserLoaded((user) => {
  userReceived(user)
})

manager.events.addSilentRenewError((error) => {
  console.error('Failed to renew token', error)
  requestUser()
})

aquireUser(window.location.search)

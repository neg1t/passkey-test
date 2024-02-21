import unjwt from 'jwt-decode'
import { createEvent, createStore, sample } from 'effector'
import { aquireUser, signoutUser, userReceived } from 'entities/auth'

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

//? events
const logout = createEvent<void>()

//? stores
const $accessToken = createStore<string>('')
  .on(aquireUser.doneData, (_, user) => user.access_token)
  .on(userReceived, (_, user) => user.access_token)

const $tokenData = $accessToken.map<ITokenData | null>((x) =>
  x ? unjwt(x) : null,
)

//? others
sample({
  clock: logout,
  target: signoutUser,
})

//TODO убрать для прода
$accessToken.updates.watch((token) => console.log('accessToken', token))
$tokenData.updates.watch((token) => console.log('token', token))

//? exports
export const events = { logout }

export const stores = {
  $accessToken,
  $tokenData,
}

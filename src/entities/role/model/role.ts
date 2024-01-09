import { TRole } from 'shared/types/entities'
import { createEffect, createEvent, createStore, sample } from 'effector'
import { tokenModel } from 'entities/token'
import { ROLES_LIST } from 'shared/config/lists'

//? effects
const writeRoleToStorage = createEffect<TRole, void>((role: TRole) => {
  localStorage.setItem('role', role)
})

//? events
const chooseRole = createEvent<TRole>()
const setRole = createEvent<TRole>()

//? stores
const $role = createStore<TRole | null>(null)
  .on(chooseRole, (_state, payload) => payload)
  .on(setRole, (_state, payload) => payload)

const $availableRoles = tokenModel.stores.$tokenData.map<TRole[] | undefined>(
  (x) => {
    if (!x?.role) {
      return ['empty']
    }
    return x?.exp
      ? (
          (x?.role
            ? typeof x.role === 'string'
              ? [x.role]
              : x.role
            : []) as TRole[]
        ).filter((role) => ROLES_LIST.includes(role))
      : undefined
  },
)

//? other
sample({
  clock: [setRole, chooseRole],
  target: writeRoleToStorage,
})

sample({
  clock: $availableRoles,
  fn: (roles): TRole => {
    const roleInLocalStorage = localStorage.getItem('role')
    const choosenRole = roles?.includes(roleInLocalStorage as TRole)
      ? (roleInLocalStorage as TRole)
      : roles?.[0]
    return !roles || !choosenRole ? 'none' : choosenRole
  },
  target: setRole,
})

//? exports

export const events = { setRole, chooseRole }

export const effects = {
  writeRoleToStorage,
}

export const stores = {
  $role,
  $availableRoles,
}

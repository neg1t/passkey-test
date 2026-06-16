import {
  $passkeyPromptVisible,
  $passkeyRegistrationStatus,
  $tokenData,
  aquireUser,
  initUserManagerFx,
  logout,
  passkeyPromptDismissed,
  registerPasskey,
  userReceived,
} from './model'

export const stores = {
  $passkeyPromptVisible,
  $passkeyRegistrationStatus,
  $tokenData,
}

export const effects = {
  aquireUser,
  initUserManagerFx,
}

export const events = {
  passkeyPromptDismissed,
  registerPasskey,
  userReceived,
  logout,
}

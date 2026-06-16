type KeycloakAccountCredential = {
  type: string
  userCredentialMetadatas?: unknown[]
}

type HasRegisteredPasskeyParams = {
  accessToken: string
  authority: string
}

function getAccountCredentialsUrl(authority: string) {
  return `${authority.replace(/\/$/, '')}/account/credentials`
}

function isKeycloakAccountCredentials(
  data: unknown,
): data is KeycloakAccountCredential[] {
  return Array.isArray(data)
}

function hasPasswordlessCredential(credentials: KeycloakAccountCredential[]) {
  return credentials.some(
    ({ type, userCredentialMetadatas }) =>
      type === 'webauthn-passwordless' &&
      Array.isArray(userCredentialMetadatas) &&
      userCredentialMetadatas.length > 0,
  )
}

export async function hasRegisteredPasskey(
  params: HasRegisteredPasskeyParams,
) {
  const { accessToken, authority } = params

  const response = await fetch(getAccountCredentialsUrl(authority), {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  })

  if (!response.ok) {
    throw new Error(
      `Failed to load Keycloak account credentials: ${response.status}`,
    )
  }

  const credentials: unknown = await response.json()
  if (!isKeycloakAccountCredentials(credentials)) {
    throw new Error('Unexpected Keycloak account credentials response')
  }

  return hasPasswordlessCredential(credentials)
}

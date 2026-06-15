# Deploy Keycloak Passkeys Demo to Render

This is the recommended cloud path when local tunnels are unstable or ngrok-free blocks browser OIDC fetches.

## Why Render

- Free web service for a temporary Docker app.
- Free managed PostgreSQL for a temporary test database.
- Public HTTPS domain without ngrok browser warning.
- Works with the existing Vercel frontend.

This setup is for testing Keycloak Passkeys/WebAuthn Passwordless, not production.

## 1. Create Render PostgreSQL

1. Open Render Dashboard.
2. Create a new PostgreSQL database.
3. Select the free plan if available.
4. Save these values from the database page:
   - Internal Database URL, preferred
   - External Database URL, fallback

Prefer the internal URL when the Keycloak web service is also on Render.

## 2. Create Render Web Service

1. Create a new Web Service from this repository.
2. Choose Docker runtime.
3. Set Dockerfile path:

```text
Dockerfile.keycloak.render
```

4. Select the free instance type.
5. Set environment variables:

```env
PORT=8080
DATABASE_URL=<Render internal database URL>
KC_BOOTSTRAP_ADMIN_USERNAME=admin
KC_BOOTSTRAP_ADMIN_PASSWORD=<strong temporary password>
KC_HTTP_HOST=0.0.0.0
KC_PROXY_HEADERS=xforwarded
KC_HOSTNAME_STRICT=false
```

Do not commit the admin password.

The start script also reads `RENDER_EXTERNAL_URL` and uses it as `KC_HOSTNAME` when available. If Keycloak generates wrong issuer URLs, set `KC_HOSTNAME` manually to the Render service URL:

```env
KC_HOSTNAME=https://<your-keycloak-service>.onrender.com
```

## 3. Verify Keycloak

After deploy, open:

```text
https://<your-keycloak-service>.onrender.com/admin
```

Then verify discovery:

```bash
curl -i https://<your-keycloak-service>.onrender.com/realms/master/.well-known/openid-configuration
```

Expected:

```text
HTTP/2 200
content-type: application/json
```

The response body must contain:

```json
"issuer"
"authorization_endpoint"
"token_endpoint"
```

## 4. Configure Realm and Client

Create realm:

```text
passkeys-demo
```

Create OIDC client:

```text
Client ID: react-template-pwa
Client authentication: Off
Standard flow: On
```

Client settings:

```text
Root URL:
https://passkey-test-steel.vercel.app

Home URL:
https://passkey-test-steel.vercel.app/main

Valid redirect URI:
https://passkey-test-steel.vercel.app/main

Web origin:
https://passkey-test-steel.vercel.app
```

Avoid `/*` in Web origins. Use the exact frontend origin.

Enable passkeys:

```text
Authentication -> Policies -> Webauthn Passwordless Policy -> Enable Passkeys
```

Create a test user and either:

- add required action `Webauthn Register Passwordless`, or
- register the passkey from Account Console.

## 5. Configure Vercel Frontend

Set Vercel environment variables:

```env
VITE_API_ROOT=''
VITE_NODE_ENV='development'
VITE_AUTH_URL='https://<your-keycloak-service>.onrender.com/realms/passkeys-demo'
VITE_CLIENT_ID='react-template-pwa'
VITE_REDIRECT_URI='https://passkey-test-steel.vercel.app/main'
VITE_SCOPE='openid profile email'
VITE_AUTH_NGROK_SKIP_BROWSER_WARNING='false'
```

Redeploy after changing `VITE_*` values.

## 6. Known Free-Tier Behavior

- Render free web services can sleep after inactivity. The first request may be slow.
- Render free PostgreSQL can have platform-specific limits or expiration rules. Check current Render plan details before relying on it for long-term demos.
- Passkeys are bound to the Keycloak host. If the Render service URL changes, register a new passkey.

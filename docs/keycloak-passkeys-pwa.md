# Локальный тест Keycloak Passkeys в PWA

## Что тестируем

Keycloak Passkeys/WebAuthn Passwordless позволяет пользователю входить через platform authenticator телефона: биометрию, PIN или экранную блокировку. Фронт при этом остается обычным OIDC-клиентом: passkey-логин проходит на странице Keycloak, а приложение получает стандартный access token после redirect callback.

Важно: WebAuthn работает только в secure context. Для телефона `http://192.168.x.x` не подходит, поэтому локальный стенд публикуется через HTTPS-туннели.

## Требования

- Docker.
- Node.js/Yarn из проекта.
- `cloudflared` для HTTPS-туннелей.
- Телефон с экранной блокировкой и поддержкой passkeys.
- Keycloak 26.4+; в этом стенде используется `quay.io/keycloak/keycloak:26.6.3`.

## Запуск Keycloak

```bash
docker compose -f docker-compose.keycloak-passkeys.yml up -d
cloudflared tunnel --url http://localhost:8080
```

Сохраните публичный HTTPS URL Keycloak, например:

```text
https://keycloak-example.trycloudflare.com
```

Для тестов дольше одного запуска используйте named Cloudflare Tunnel со стабильным доменом. Passkey привязан к host, поэтому после смены `trycloudflare.com` URL ранее зарегистрированный passkey не будет подходить.

## Настройка Keycloak

1. Откройте `https://<keycloak-tunnel>/admin`.
2. Войдите под `admin` / `admin`, если не переопределяли env-переменные.
3. Создайте realm `passkeys-demo`.
4. Создайте client:
   - Client ID: `react-template-pwa`
   - Client type: OpenID Connect
   - Client authentication: Off
   - Standard flow: On
5. После запуска фронта заполните:
   - Valid redirect URI: `https://<frontend-tunnel>/main`
   - Web origin: `https://<frontend-tunnel>`
6. Включите passkeys:
   - Authentication -> Policies -> Webauthn Passwordless Policy
   - Enable Passkeys
7. Создайте тестового пользователя и задайте ему required action `Webauthn Register Passwordless`, либо зарегистрируйте passkey через Account Console.

## Запуск фронта

Соберите приложение и запустите preview:

```bash
yarn build
yarn preview --host 0.0.0.0 --port 4173
cloudflared tunnel --url http://localhost:4173
```

Создайте `.env.local` перед сборкой, подставив оба HTTPS URL:

```env
VITE_API_ROOT=''
VITE_NODE_ENV='development'
VITE_AUTH_URL='https://<keycloak-tunnel>/realms/passkeys-demo'
VITE_CLIENT_ID='react-template-pwa'
VITE_REDIRECT_URI='https://<frontend-tunnel>/main'
VITE_SCOPE='openid profile email'
```

Если tunnel URL изменился, пересоберите фронт: Vite подставляет `VITE_*` переменные на этапе build.

## Альтернатива: фронт на Vercel, Keycloak через ngrok

Если локальный `vite preview` или Cloudflare Tunnel мешают тесту, фронт можно выложить на Vercel. Это дает стабильный HTTPS origin для PWA, а локально нужно пробросить только Keycloak.

1. Запустите Keycloak:

```bash
docker compose -f docker-compose.keycloak-passkeys.yml up -d
```

2. Пробросьте Keycloak через ngrok:

```bash
ngrok http 8080
```

3. В Vercel создайте проект из репозитория:
   - Framework Preset: Vite
   - Build Command: `yarn build`
   - Output Directory: `dist`

4. В Vercel Project Settings -> Environment Variables задайте:

```env
VITE_API_ROOT=''
VITE_NODE_ENV='development'
VITE_AUTH_URL='https://<keycloak-ngrok-url>/realms/passkeys-demo'
VITE_CLIENT_ID='react-template-pwa'
VITE_REDIRECT_URI='https://<vercel-project-domain>/main'
VITE_SCOPE='openid profile email'
VITE_AUTH_NGROK_SKIP_BROWSER_WARNING='true'
```

5. Redeploy проекта обязателен после изменения `VITE_*` переменных.

6. В Keycloak client `react-template-pwa` задайте:

```text
Valid redirect URI:
https://<vercel-project-domain>/main

Web origin:
https://<vercel-project-domain>
```

Файл `vercel.json` в корне проекта переписывает все routes на `index.html`, поэтому callback на `/main` корректно откроется в React Router, а не завершится 404 на стороне Vercel.

## Проверка на телефоне

1. Откройте `https://<frontend-tunnel>` на телефоне.
2. Установите приложение как PWA, если нужно проверить standalone-режим.
3. Перейдите в приложение и дождитесь redirect на Keycloak.
4. Войдите тестовым пользователем.
5. Зарегистрируйте passkey через биометрию, PIN или экранную блокировку.
6. Выйдите и повторите вход через passkey.
7. После возврата на `/main` приложение должно получить реальный access token и отправлять его как `Authorization: Bearer <token>`.

## Частые ошибки

- `http://192.168.x.x` не подходит для WebAuthn на телефоне; используйте HTTPS.
- Redirect URI в client не совпадает с `VITE_REDIRECT_URI`.
- Web origin не совпадает с frontend HTTPS origin.
- Сменился tunnel host, а passkey был зарегистрирован для старого host.
- `.env.local` изменили после `yarn build`, но фронт не пересобрали.
- Service worker обслуживает старую сборку. Закройте PWA, очистите site data или измените версию сборки и пересоберите.

## Источники

- [Keycloak 26.3 passkeys release](https://www.keycloak.org/2025/07/keycloak-2630-released)
- [Keycloak downloads](https://www.keycloak.org/downloads)
- [Keycloak hostname docs](https://www.keycloak.org/server/hostname)
- [Keycloak reverse proxy docs](https://www.keycloak.org/server/reverseproxy)
- [MDN WebAuthn secure context](https://developer.mozilla.org/en-US/docs/Web/API/Web_Authentication_API)

#!/usr/bin/env sh
set -eu

export KC_HTTP_ENABLED="${KC_HTTP_ENABLED:-true}"
export KC_HTTP_PORT="${PORT:-8080}"
export KC_PROXY_HEADERS="${KC_PROXY_HEADERS:-xforwarded}"
export KC_HOSTNAME_STRICT="${KC_HOSTNAME_STRICT:-false}"
export KC_HEALTH_ENABLED="${KC_HEALTH_ENABLED:-true}"
export KC_METRICS_ENABLED="${KC_METRICS_ENABLED:-true}"
export JAVA_OPTS_APPEND="${JAVA_OPTS_APPEND:--XX:MaxRAMPercentage=75 -XX:InitialRAMPercentage=25}"

if [ -n "${RENDER_EXTERNAL_URL:-}" ] && [ -z "${KC_HOSTNAME:-}" ]; then
  export KC_HOSTNAME="$RENDER_EXTERNAL_URL"
fi

if [ -n "${DATABASE_URL:-}" ] && [ -z "${KC_DB_URL:-}" ]; then
  db_url="${DATABASE_URL#postgres://}"
  db_url="${db_url#postgresql://}"
  credentials="${db_url%@*}"
  location="${db_url#*@}"
  host_port="${location%%/*}"
  database="${location#*/}"
  database="${database%%\?*}"

  export KC_DB="${KC_DB:-postgres}"
  export KC_DB_USERNAME="${KC_DB_USERNAME:-${credentials%%:*}}"
  export KC_DB_PASSWORD="${KC_DB_PASSWORD:-${credentials#*:}}"
  export KC_DB_URL="jdbc:postgresql://${host_port}/${database}"
fi

exec /opt/keycloak/bin/kc.sh start-dev \
  --http-enabled="${KC_HTTP_ENABLED}" \
  --http-port="${KC_HTTP_PORT}" \
  --proxy-headers="${KC_PROXY_HEADERS}" \
  --hostname-strict="${KC_HOSTNAME_STRICT}"

#!/bin/bash
# Установка AI-экосистемы ГК Садыхан на чистый сервер Ubuntu 22.04/24.04.
# Запуск (от root, из распакованной папки пакета):  bash install.sh
# Ставит Node.js 22 и nginx, создаёт службу, включает вход по паролю и печатает ссылку.
set -euo pipefail
[ "$(id -u)" = 0 ] || { echo "Запустите от root: sudo bash install.sh"; exit 1; }
SRC="$(cd "$(dirname "$0")" && pwd)"
APP=/opt/sadykhan-ecosystem

echo "== 1/5 Пакеты системы"
export DEBIAN_FRONTEND=noninteractive
apt-get update -qq
apt-get install -y -qq curl ca-certificates nginx openssl >/dev/null
if ! command -v node >/dev/null || [ "$(node -p 'process.versions.node.split(".")[0]')" -lt 22 ]; then
  curl -fsSL https://deb.nodesource.com/setup_22.x | bash - >/dev/null
  apt-get install -y -qq nodejs >/dev/null
fi
echo "Node.js $(node -v)"

echo "== 2/5 Файлы платформы в $APP"
id sadykhan >/dev/null 2>&1 || useradd -r -s /usr/sbin/nologin -d "$APP" sadykhan
mkdir -p "$APP"
if [ "$SRC" != "$APP" ]; then
  cp -r "$SRC"/public "$SRC"/server.js "$APP"/
  [ -d "$APP/data" ] || cp -r "$SRC"/seed "$APP"/
  cp "$SRC"/config.example.json "$SRC"/sadykhan-ecosystem.service "$SRC"/ИНСТРУКЦИЯ.* "$APP"/ 2>/dev/null || true
fi

echo "== 3/5 Настройки"
NEWPASS=""
if [ ! -f "$APP/config.json" ]; then
  NEWPASS="$(openssl rand -base64 18 | tr -d '/+=' | cut -c1-16)"
  echo "Ключ Anthropic API для ИИ-агентов (Enter — пропустить, можно добавить позже в $APP/config.json):"
  read -r -s AIKEY || AIKEY=""
  node -e '
    const c = require(process.argv[1]); c.HOST = "127.0.0.1"; c.PORT = 8080;
    c.BASIC_AUTH = "audit:" + process.argv[2]; c.ANTHROPIC_API_KEY = process.argv[3] || "";
    require("fs").writeFileSync(process.argv[4], JSON.stringify(c, null, 2));
  ' "$APP/config.example.json" "$NEWPASS" "$AIKEY" "$APP/config.json"
fi
chown -R sadykhan "$APP"; chmod 600 "$APP/config.json"

echo "== 4/5 Служба"
cp "$APP/sadykhan-ecosystem.service" /etc/systemd/system/
systemctl daemon-reload
systemctl enable --now sadykhan-ecosystem >/dev/null
systemctl restart sadykhan-ecosystem

echo "== 5/5 Веб-сервер nginx (порт 80)"
cat > /etc/nginx/sites-available/sadykhan <<'NGX'
server {
  listen 80 default_server;
  server_name _;
  client_max_body_size 30m;
  location / {
    proxy_pass http://127.0.0.1:8080;
    proxy_http_version 1.1;
    proxy_read_timeout 600s;
    proxy_set_header Host $host;
    proxy_set_header Authorization $http_authorization;
  }
}
NGX
ln -sf /etc/nginx/sites-available/sadykhan /etc/nginx/sites-enabled/sadykhan
rm -f /etc/nginx/sites-enabled/default
nginx -t -q && systemctl reload nginx
if command -v ufw >/dev/null && ufw status | grep -q active; then ufw allow 80/tcp >/dev/null; ufw allow 443/tcp >/dev/null; fi

sleep 2
IP="$(curl -s -4 https://ifconfig.me || hostname -I | awk '{print $1}')"
if curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:8080/api/info -u "$(node -p 'require("'"$APP"'/config.json").BASIC_AUTH')" | grep -q 200; then
  echo
  echo "================================================================"
  echo " Готово. Ссылка:  http://$IP/"
  if [ -n "$NEWPASS" ]; then
    echo " Логин:  audit"
    echo " Пароль: $NEWPASS"
    echo " Сохраните пароль. Его можно сменить в $APP/config.json (BASIC_AUTH),"
    echo " затем: systemctl restart sadykhan-ecosystem"
  fi
  echo " ИИ: $(curl -s -u "$(node -p 'require("'"$APP"'/config.json").BASIC_AUTH')" http://127.0.0.1:8080/api/info)"
  echo "================================================================"
else
  echo "Сервер не ответил. Журнал: journalctl -u sadykhan-ecosystem -n 50"; exit 1
fi

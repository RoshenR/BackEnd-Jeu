#!/usr/bin/env sh
set -eu

API_URL="${API_URL:-http://localhost:3001}"
cat > /usr/share/nginx/html/config.js <<EOF
window.__API_URL__ = "${API_URL}";
EOF

exec nginx -g 'daemon off;'

#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
PORT="${PORT:-4173}"
HOST="${HOST:-0.0.0.0}"
echo "Starting server at http://${HOST}:${PORT}"
exec /usr/bin/python3 -m http.server "$PORT" --bind "$HOST"

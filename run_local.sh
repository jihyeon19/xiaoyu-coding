#!/usr/bin/env bash
set -euo pipefail
PORT="${1:-8000}"

export HOST="127.0.0.1"
export PORT

echo "🔒 Private mode enabled (local only)."
echo "Server: http://127.0.0.1:${PORT}"
echo "Open in browser:"
echo "  1) http://127.0.0.1:${PORT}/preview.html  (recommended)"
echo "  2) http://127.0.0.1:${PORT}/"
echo "  3) http://127.0.0.1:${PORT}/preview/"
echo
echo "Press Ctrl + C to stop server."

python3 server.py

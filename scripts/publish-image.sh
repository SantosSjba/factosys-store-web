#!/usr/bin/env bash
# Build linux/amd64 + push a Docker Hub (Coolify solo hace pull).
set -euo pipefail

IMAGE="${IMAGE:-santossjba/factosys-store-web:latest}"
PLATFORM="${PLATFORM:-linux/amd64}"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"

cd "$ROOT"

echo "==> Building and pushing ${IMAGE} (${PLATFORM})"
docker buildx build --platform "$PLATFORM" \
  -t "$IMAGE" \
  --push \
  .

echo "==> Done. En Coolify: Deploy / Force rebuild (pull latest)."
echo "    Health: https://store.factosysperu.com/"

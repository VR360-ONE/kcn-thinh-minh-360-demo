#!/usr/bin/env bash
# Triển khai static lên FTP stg.vr360.one → du-an/<DEPLOY_SUBDIR>/
#
# Chi tiết: DEPLOY-FTP.md (cùng thư mục). Trong monorepo ai-tools: ../docs/deploy-ftp-stg-vr360.md.
# Cài lftp (macOS): brew install lftp
#
# Tạo file .env.deploy (đã gitignore) hoặc export biến:
#   FTP_HOST=stg.vr360.one
#   FTP_USER=ftp_stg_ws02
#   FTP_PASS=...
#   FTP_PORT=21
#   FTP_REMOTE_BASE=du-an
#   DEPLOY_SUBDIR=kcn-thinh-minh-360-demo
#
# Chạy: ./deploy-ftp.sh
set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

if [[ -f .env.deploy ]]; then
  set -a
  # shellcheck source=/dev/null
  source .env.deploy
  set +a
fi

: "${FTP_HOST:=stg.vr360.one}"
: "${FTP_USER:=ftp_stg_ws02}"
: "${FTP_PORT:=21}"
: "${FTP_REMOTE_BASE:=du-an}"
: "${DEPLOY_SUBDIR:=kcn-thinh-minh-360-demo}"

if [[ -z "${FTP_PASS:-}" ]]; then
  echo "Thiếu FTP_PASS. Tạo .env.deploy với FTP_PASS=... hoặc export trước khi chạy." >&2
  exit 1
fi

if ! command -v lftp >/dev/null 2>&1; then
  echo "Chưa có lftp. Cài: brew install lftp" >&2
  exit 1
fi

REMOTE_PATH="${FTP_REMOTE_BASE}/${DEPLOY_SUBDIR}"
echo "Mirror . → ${FTP_HOST}:${REMOTE_PATH}/"

LFTP_SCRIPT=$(mktemp)
trap 'rm -f "$LFTP_SCRIPT"' EXIT
{
  printf '%s\n' "set ssl:verify-certificate no"
  printf '%s\n' "set ftp:passive-mode true"
  printf 'open -u %s,%s -p %s %s\n' "$FTP_USER" "$FTP_PASS" "$FTP_PORT" "$FTP_HOST"
  printf 'lcd %s\n' "$SCRIPT_DIR"
  printf '%s\n' "mirror -R --verbose --parallel=3 --exclude-glob '.git/**' --exclude-glob '.env*' --exclude-glob '.DS_Store' . ${REMOTE_PATH}"
  printf '%s\n' "bye"
} > "$LFTP_SCRIPT"

lftp -f "$LFTP_SCRIPT"

echo "Xong. Mặc định user ws-02 — URL:"
echo "  https://stg.vr360.one/ws-02/${REMOTE_PATH}/"

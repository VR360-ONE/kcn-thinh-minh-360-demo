# Quy trình deploy static lên FTP staging (stg.vr360.one)

Script mẫu trong repo này: [`deploy-ftp.sh`](./deploy-ftp.sh). Nếu bạn clone cả workspace cha `ai-tools` (có thư mục `docs/`), có thêm bản cùng nội dung tại `docs/deploy-ftp-stg-vr360.md`.

Tài liệu mô tả cách đẩy **site tĩnh** (HTML/JS/CSS/assets) lên FTP `stg.vr360.one`, **áp dụng lại cho project static khác**.

## Dùng cho source mới

1. **Copy** `deploy-ftp.sh` vào **root thư mục static** (cùng cấp `index.html`).
2. Chỉnh trong script (default) hoặc chỉ dùng `.env.deploy` / `export`:
   - `FTP_USER` (`ftp_stg_ws01` vs `ftp_stg_ws02`)
   - `DEPLOY_SUBDIR` (tên thư mục con dưới `du-an`, ví dụ `my-app-demo`)
3. Copy **đoạn `.gitignore`** liên quan `.env*` / `.env.deploy` nếu project chưa có.
4. (Tuỳ chọn) Copy file **`DEPLOY-FTP.md`** này vào project mới để luôn có hướng dẫn.

## Chuẩn bị

1. **Cài `lftp`** (macOS): `brew install lftp`
2. **Tài khoản FTP** do hosting cấp. **URL web** tương ứng:
   - User kiểu `ftp_stg_ws01` → thường `https://stg.vr360.one/ws-01/...`
   - User kiểu `ftp_stg_ws02` → `https://stg.vr360.one/ws-02/...`
3. **Đường remote** phổ biến: base `du-an`, mỗi site một **thư mục con** (ví dụ `du-an/ten-project/`).

## Biến cấu hình

| Biến | Mặc định (script demo) | Ý nghĩa |
|------|------------------------|---------|
| `FTP_HOST` | `stg.vr360.one` | Host FTP |
| `FTP_PORT` | `21` | Cổng |
| `FTP_USER` | `ftp_stg_ws01` | User (đổi đúng ws01/ws02) |
| `FTP_PASS` | *(bắt buộc)* | Mật khẩu — **không** commit |
| `FTP_REMOTE_BASE` | `du-an` | Thư mục gốc trên FTP |
| `DEPLOY_SUBDIR` | `kcn-thinh-minh-360-demo` | Thư mục con (tên URL-friendly) |

Remote đầy đủ: `${FTP_REMOTE_BASE}/${DEPLOY_SUBDIR}`.

## File `.env.deploy` (local, không commit)

Trong root project static, tạo `.env.deploy` (nên có trong `.gitignore`: `.env.deploy` hoặc `.env.*`):

```bash
FTP_PASS='mật-khẩu'
# Tuỳ chọn ghi đè:
# FTP_USER=ftp_stg_ws02
# DEPLOY_SUBDIR=my-other-demo
```

Hoặc chỉ export trước khi chạy:

```bash
export FTP_USER=ftp_stg_ws01
export FTP_PASS='...'
```

## Chạy deploy

```bash
cd /đường-dẫn/tới/thư-mục-static
chmod +x deploy-ftp.sh   # lần đầu
./deploy-ftp.sh
```

Script `lcd` đúng thư mục chứa script và `mirror -R` nội dung (trừ các pattern loại trừ).

## Loại trừ khi mirror

Script mẫu loại: `.git/**`, `.env*`, `.DS_Store`. Project khác có thể thêm `--exclude-glob` (ví dụ `node_modules`, `*.md`) trong lệnh `mirror` trong `deploy-ftp.sh`.

## URL kiểm tra sau deploy

Pattern:

`https://stg.vr360.one/ws-XX/<FTP_REMOTE_BASE>/<DEPLOY_SUBDIR>/`

Thay `ws-XX` theo user. Ví dụ kiểm tra:

```bash
curl -sI "https://stg.vr360.one/ws-01/du-an/ten-project/index.html"
```

Kỳ vọng `200 OK` khi path và upload đúng.

## Git và FTP **không** tự đồng bộ

FTP chỉ phản ánh nội dung **lúc bạn chạy** `deploy-ftp.sh`. Muốn biết staging khớp commit nào: ghi chú sau deploy, hoặc sinh `version.txt` / comment build từ `git rev-parse --short HEAD` trong quy trình (có thể bổ sung sau).

## Lưu ý kỹ thuật `lftp` (macOS / Homebrew)

- **Không** dùng `lftp -u ... host -f file` — báo xung đột. Script mẫu dùng `open -u user,pass ...` **trong** file script, rồi `lftp -f file`.
- Passive mode lỗi: thử `set ftp:passive-mode false` trong script.

## Bảo mật

- Không commit `.env.deploy` hoặc mật khẩu.
- Mật khẩu lộ ngoài → **đổi mật khẩu** trên hosting.

## Checklist project static mới

1. [ ] Copy `deploy-ftp.sh`, `chmod +x`
2. [ ] Sửa default `FTP_USER` và `DEPLOY_SUBDIR` (hoặc `.env.deploy`)
3. [ ] `.gitignore` có `.env*` / `.env.deploy`
4. [ ] `./deploy-ftp.sh` → mở URL `ws-01` hoặc `ws-02` tương ứng
5. [ ] DevTools → Network: `index.html`, JS chính, asset lớn trả 200

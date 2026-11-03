# Tinh hạm Orthos – quy ước khi sửa

- `index.html` được sinh từ `src/` bằng `node src/mk.js` (ghép `src.html` + `data.js` + three.js + `ship3d.js` + `art.js` + `design.js` + `pets.js`). Không sửa tay `index.html`.
- `data.js` sinh từ dữ liệu sách bằng `export.js` (cần thư mục `book/`, `book2/` của sách – không có trong repo).
- Lưu tiến độ: localStorage khoá `orthos-v1` (gems, cards, done, tk, xp, buddy, alt, sw, intro, snd, music).
- Thẻ chia 4 bậc (trường `rar`): Bậc 1 G, V; Bậc 2 P, K; Bậc 3 N, T, S, Q; Bậc 4 B (bài toán phụ). Pet chỉ mang tên loài + mã thẻ (vd. "Cáo G1"), không đặt biệt danh theo kiến thức; pet lên Cấp 1–3 (mốc 3 và 8 lần xuất chiêu).
- Chế độ giáo viên: nút "Giáo viên" trên HUD. Chỉ lưu `TEACHER_HASH = SHA-256("tinhhamorthos:" + mật khẩu)`, **không bao giờ ghi mật khẩu dạng chữ vào repo**. Khi bật (lưu trong sessionStorage `orthos-gv`): mở mọi khoang/bài/thẻ, nút Đáp án GV, Điền đáp án (bước 2), Tự lắp (bước 3), đánh dấu lệnh đúng ở Xưởng Thiết Kế; `save()` không ghi gì, thoát ra thì đọc lại tiến độ cũ.
- Chữ trong game, README, commit viết tiếng Việt.

# Tinh hạm Orthos – quy ước khi sửa

- `index.html` được sinh từ `src/` bằng `node src/mk.js` (ghép `src.html` + `data.js` + three.js + `ship3d.js` + `art.js` + `design.js` + `pets.js`). Không sửa tay `index.html`.
- Tàu 3D: `ship3d.js` vẽ tàu bằng code trước, rồi tải `models/orthos.glb` (dựng bằng `blender/orthos_ship.py`, sửa tay ở `blender/orthos.blend`) và thay vào nếu đủ 8 khoang. Quy ước trong glb: Empty có extras `zone`, `anchor`, `spin_ax`/`spin_v`, `flame_r`, `holo`; vật liệu theo tên (hull, plate, light, dark, glass, stripe, win, acc, holo). `src/gltf.js` sinh bằng `node src/mk-gltf.js`. Cần `t3/` (npm i three@0.150.1 esbuild) để build.
- `data.js` sinh từ dữ liệu sách bằng `export.js` (cần thư mục `book/`, `book2/` của sách – không có trong repo).
- Lưu tiến độ: localStorage khoá `orthos-v1` (gems, cards, done, tk, xp, buddy, alt, so, sw, intro, snd, music); `so[id]` là danh sách các cách giải học sinh tự lưu cho bài `id`.
- Thẻ chia 4 bậc (trường `rar`): Bậc 1 G, V; Bậc 2 P, K; Bậc 3 N, T, S, Q; Bậc 4 B (bài toán phụ). Pet chỉ mang tên loài + mã thẻ (vd. "Cáo G1"), không đặt biệt danh theo kiến thức; pet lên Cấp 1–3 (mốc 3 và 8 lần xuất chiêu).
- Chế độ giáo viên: nút "Giáo viên" trên HUD. Chỉ lưu `TEACHER_HASH = SHA-256("tinhhamorthos:" + mật khẩu)`, **không bao giờ ghi mật khẩu dạng chữ vào repo**. Khi bật (lưu trong sessionStorage `orthos-gv`): mở mọi khoang/bài/thẻ, nút Đáp án GV, Điền đáp án (bước 2), Tự lắp (bước 3), đánh dấu lệnh đúng ở Xưởng Thiết Kế; `save()` không ghi gì, thoát ra thì đọc lại tiến độ cũ.
- Chữ trong game, README, commit viết tiếng Việt.
- Chuỗi chứng minh trong máy chỉ là **một trong các hướng làm gợi ý** (gọi là "chuỗi gợi ý", không gọi "chuỗi mẫu" trên giao diện). Luôn ưu tiên học sinh lưu lại cách của mình: "Cách của em" ở bước 3 → "Lưu vào Sổ cách giải" (mỗi bài lưu nhiều cách), xem/chép/xoá ở màn "Sổ cách giải".

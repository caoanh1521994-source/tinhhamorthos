# Tinh hạm Orthos

Web game sưu tầm thẻ kiến thức – lắp ráp chứng minh hình học, dựa trên quyển **Tư duy hình học 9**.

- `index.html` – bản chạy (một trang, đã nhúng sẵn dữ liệu, three.js và hình tàu 3D)
- `img/` – hình vẽ của các bài
- `models/orthos.glb` – mô hình tàu 3D dựng bằng Blender (game tải file này; không tải được thì dùng tàu vẽ bằng code)
- `blender/` – `orthos.blend` (mở bằng Blender để sửa tàu) và `orthos_ship.py` (script dựng lại tàu từ đầu)
- `src/` – mã nguồn: `src.html` (game), `art.js` (hình minh hoạ, nhạc), `ship3d.js` (tàu 3D), `gltf.js` (bộ đọc .glb), `design.js` (Xưởng Thiết Kế – dữ liệu dựng hình lấy từ trang Vehinhdong9), `pets.js` (45 pet tri thức, mỗi thẻ một pet), `data.js` (dữ liệu bài và thẻ)

Xưởng Thiết Kế: người chơi chọn đúng lệnh dựng theo thứ tự cho 4 bài (1.1, 2.6, 3.3, 4.6), kéo thử điểm tự do, rồi trả lời câu hỏi quan sát; nhật ký dựng có cách làm trên GeoGebra và Sketchpad.

Pet tri thức: mỗi thẻ là một pet thuộc 9 loài/hệ (Cáo–Góc, Rùa–Tam giác vuông, Mochi–Đường tròn, Chim–Tiếp tuyến, Thỏ–Đồng dạng, Tắc kè–Song song, Cú–Đồng quy, Kỳ nhông–Đổi kết luận, Thần long–Bài toán phụ). Mở gói = bắt pet; gắn đúng thẻ khi lắp ráp thì pet xuất chiêu và lên cấp (Cấp 1 → 3); chọn pet đồng hành trên sơ đồ tàu. Thẻ chia 4 bậc (Bậc 1: góc, tam giác vuông; Bậc 2: song song – Thales, đổi kết luận; Bậc 3: đường tròn, tiếp tuyến, đồng dạng, đồng quy; Bậc 4: bài toán phụ); pet chỉ mang tên loài và mã thẻ (vd. Cáo G1), lớn lên theo Cấp 1–3.

Sổ cách giải: chuỗi chứng minh trong game chỉ là một trong các hướng làm gợi ý; học sinh gõ cách của mình ở bước 3 (Cách của em), lưu nhiều cách cho mỗi bài vào Sổ cách giải, chép để gửi giáo viên.

Chế độ giáo viên: nút "Giáo viên" trên thanh trên cùng, nhập mật khẩu để mở mọi khoang, bài, thẻ và xem đáp án (không ghi vào tiến độ học sinh).

Sửa tàu 3D bằng Blender:
1. Mở `blender/orthos.blend`, sửa hình (giữ nguyên tên các Empty `Z_train`, `Z_ch1`…`Z_tk`, `HULL` và custom property của chúng).
2. `File → Export → glTF 2.0`: Format **glTF Binary (.glb)**; Include: tick **Custom Properties** (bắt buộc – thiếu thì game không nhận ra khoang); Transform: **+Y Up**; Data: tick **Apply Modifiers**.
3. Lưu đè `models/orthos.glb`, đẩy lên GitHub. Không cần build lại `index.html`.
Tên vật liệu quyết định màu trong game: `hull`, `plate`, `light`, `dark`, `glass`, `stripe`, `win`, `acc` (màu khoang, đổi theo trạng thái), `holo`; vật liệu tên khác giữ nguyên màu đặt trong Blender.

Triển khai: Vercel, dự án tĩnh, thư mục gốc của repo.

# Tinh hạm Orthos

Web game sưu tầm thẻ kiến thức – lắp ráp chứng minh hình học, dựa trên quyển **Tư duy hình học 9**.

- `index.html` – bản chạy (một trang, đã nhúng sẵn dữ liệu, three.js và hình tàu 3D)
- `img/` – hình vẽ của các bài
- `src/` – mã nguồn: `src.html` (game), `art.js` (hình minh hoạ, nhạc), `ship3d.js` (tàu 3D), `design.js` (Xưởng Thiết Kế – dữ liệu dựng hình lấy từ trang Vehinhdong9), `pets.js` (45 pet tri thức, mỗi thẻ một pet), `data.js` (dữ liệu bài và thẻ)

Xưởng Thiết Kế: người chơi chọn đúng lệnh dựng theo thứ tự cho 4 bài (1.1, 2.6, 3.3, 4.6), kéo thử điểm tự do, rồi trả lời câu hỏi quan sát; nhật ký dựng có cách làm trên GeoGebra và Sketchpad.

Pet tri thức: mỗi thẻ là một pet thuộc 9 loài/hệ (Cáo–Góc, Rùa–Tam giác vuông, Mochi–Đường tròn, Chim–Tiếp tuyến, Thỏ–Đồng dạng, Tắc kè–Song song, Cú–Đồng quy, Kỳ nhông–Đổi kết luận, Thần long–Bài toán phụ). Mở gói = bắt pet; gắn đúng thẻ khi lắp ráp thì pet xuất chiêu và tiến hoá (Bé → Lớn → Tiến hoá); chọn pet đồng hành trên sơ đồ tàu.

Triển khai: Vercel, dự án tĩnh, thư mục gốc của repo.

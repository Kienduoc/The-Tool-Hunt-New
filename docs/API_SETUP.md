# Hướng dẫn lấy API Key miễn phí

Ứng dụng này sử dụng YouTube Data API và Google Gemini API. Cả hai đều có gói miễn phí (Free Tier) hào phóng cho mục đích phát triển và sử dụng cá nhân.

## 1. YouTube Data API v3 (Miễn phí)

YouTube API cho phép ứng dụng lấy thông tin chi tiết về video (tiêu đề, mô tả, thời lượng).

**Các bước thực hiện:**

1. Truy cập [Google Cloud Console](https://console.cloud.google.com/).
2. Tạo một Project mới (hoặc chọn project có sẵn).
3. Ở thanh tìm kiếm trên cùng, gõ "YouTube Data API v3" và chọn kết quả tương ứng.
4. Nhấn **Enable** (Bật).
5. Sau khi bật xong, nhấn vào nút **Create Credentials** (Tạo thông tin đăng nhập).
6. Ở phần "Which API are you using?", chọn **YouTube Data API v3**.
7. Ở phần "What data will you be accessing?", chọn **Public data**.
8. Nhấn **Next**. Bạn sẽ nhận được một **API Key**.
9. Copy API Key này.

**Lưu ý:** Gói miễn phí cho phép 10,000 đơn vị quota mỗi ngày, quá đủ cho việc test và sử dụng cá nhân.

## 2. Google Gemini API (Miễn phí)

Gemini API được sử dụng để phân tích nội dung video và gợi ý công cụ AI.

**Các bước thực hiện:**

1. Truy cập [Google AI Studio](https://aistudio.google.com/).
2. Đăng nhập bằng tài khoản Google của bạn.
3. Nhấn vào nút **Get API key** ở góc trên bên trái.
4. Nhấn **Create API key**.
5. Chọn project Google Cloud bạn vừa tạo ở bước trên (hoặc tạo mới).
6. Copy API Key vừa tạo.

**Chi phí:**
- Model **Gemini 1.5 Flash** có gói miễn phí (Free of Charge) với giới hạn rate limit nhất định (15 RPM, 1 triệu token/phút, 1,500 requests/ngày). Đây là mức rất thoải mái cho việc phát triển.
- Đảm bảo bạn đang sử dụng gói "Pay-as-you-go" nhưng không add thẻ hoặc chỉ dùng trong hạn mức miễn phí. Google AI Studio mặc định cung cấp tier miễn phí cho Gemini 1.5 Flash.

## 3. Cấu hình vào ứng dụng

Mở file `.env.local` trong thư mục gốc của dự án và thêm 2 key vừa lấy được vào:

```env
NEXT_PUBLIC_YOUTUBE_API_KEY=YOUR_YOUTUBE_API_KEY_HERE
GOOGLE_API_KEY=YOUR_GEMINI_API_KEY_HERE
```

Sau khi lưu file, bạn cần khởi động lại ứng dụng để áp dụng thay đổi.

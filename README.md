# 🍕 Service Link System for Pizza Restaurant

> 📱 **Capstone Project - Staff App**  
> Hệ thống liên kết phục vụ giúp tối ưu hóa hoạt động trong nhà hàng Pizza.

Ứng dụng được xây dựng bằng **React Native + Expo**, hướng đến việc hỗ trợ nhân viên trong việc tiếp nhận order, theo dõi tình trạng đơn hàng và cải thiện quy trình phục vụ khách.

---

## 🚀 Yêu cầu

- Node.js >= 16.x
- npm hoặc yarn
- Expo CLI (`npm install -g expo-cli`)
- Ứng dụng **Expo Go** trên điện thoại (Android/iOS)

---

## 📦 Cài đặt

1. **Clone dự án:**

```bash
git clone https://github.com/MeoKool/Capstone-project-order-pizza-staff.git
cd Capstone-project-order-pizza-staff
```

2. **Cài dependencies:**

```bash
npm install
# hoặc
yarn install
```

3. **Cấu hình biến môi trường (nếu có):**

Tạo file `.env` (nếu project có dùng biến môi trường). Nếu có sẵn `.env.example`, bạn có thể sao chép:

```bash
cp .env.example .env
```

---

## ▶️ Chạy ứng dụng

Khởi động server expo:

```bash
npx expo start
```

Sau đó bạn sẽ thấy một QR code hiện ra trong terminal hoặc trình duyệt. Bạn có thể:

- Quét QR bằng app **Expo Go** để mở trên điện thoại.
- Nhấn `a` để chạy trên Android Emulator.
- Nhấn `i` để chạy trên iOS Simulator (chỉ dùng được trên macOS có cài Xcode).

---

## 🧭 Cấu trúc thư mục chính

```bash
src/
├── api/            # Cấu hình gọi API (Axios)
├── components/     # Các thành phần UI tái sử dụng
├── navigation/     # Cấu hình điều hướng giữa các màn hình
├── screen/         # Các màn hình giao diện chính
├── utils/          # Hàm tiện ích, xử lý logic phụ trợ
.env                # Biến môi trường (nếu dùng)
App.js             # Entry point chính
```

---

## 📄 Giấy phép

Dự án mang tính học thuật – phục vụ môn học **Capstone Project** – không sử dụng cho mục đích thương mại.

---

## 👥 Nhóm phát triển

- 👨‍💻 [MeoKool](https://github.com/MeoKool) 
- 🎓 Capstone Project

---
title: "Flutter Dio 網路請求套件 (Dio HTTP Client)"
category: "concept"
tags: [flutter, dio, networking, api]
created: 2026-05-24
sources: ["user-request-topic-flutter-dio"]
---

# Flutter Dio 網路請求套件 (Dio HTTP Client)

---

## 📖 Definition / Overview
在 Flutter 開發中，與伺服器進行 API 互動是不可或缺的。雖然 Dart 官方提供了基礎的 `http` 套件，但 **`dio`** 是社群公認最強大、最受歡迎的 **HTTP 網路請求客戶端套件**。它支援豐富的進階功能，是企業級 Flutter 專案的標準配備。

### 為什麼選擇 Dio？
* **攔截器 (Interceptors)**：可以在請求送出前、或收到回應後，統一攔截進行處理（如自動加上 Token、統一處理 Token 過期）。
* **全域配置 (Global Configuration)**：設定 BaseURL、連接逾時（Timeout）等。
* **強大的錯誤處理 (DioException)**：分類細緻的錯誤種類。
* **其他進階功能**：檔案上傳/下載進度監聽、請求取消 (CancelToken)、FormData 傳輸等。

---

## 🛠️ Dio 基礎語法與網路請求

### 1. 安裝與匯入
在 `pubspec.yaml` 中新增依賴：
```yaml
dependencies:
  dio: ^5.0.0 # 請使用最新穩定版本
```

### 2. 基本 GET 請求
```dart
import 'package:dio/dio.dart';

void fetchUserData() async {
  final dio = Dio();
  try {
    // 送出 GET 請求
    final response = await dio.get('https://api.example.com/users/1');
    
    // Dio 會自動將 Response 轉換為 Map (JSON)
    print(response.data);
    print(response.data['username']); // 取得資料
  } on DioException catch (e) {
    // 捕獲 Dio 專用的例外錯誤
    print('請求失敗: ${e.message}');
  }
}
```

### 3. 基本 POST 請求
```dart
void loginUser() async {
  final dio = Dio();
  try {
    final response = await dio.post(
      'https://api.example.com/login',
      data: {
        'email': 'user@example.com',
        'password': 'my-password-123',
      },
    );
    print('登入成功: ${response.data}');
  } on DioException catch (e) {
    print('登入失敗: ${e.response?.data['message'] ?? '未知錯誤'}');
  }
}
```

---

## 💡 術語對照與白話解釋 (Terminology)

* **`BaseOptions` (基礎配置)**：用來設定 API 伺服器主機網址 (`baseUrl`)、連線逾時 (`connectTimeout`) 等全域參數的設定檔。
* **`Interceptor` (攔截器)**：就像是海關。在貨物（請求）出國前檢查護照（加 Token），或在國外貨物（回應）入境時消毒（統一解析錯誤）。
* **`CancelToken` (取消權限)**：如果使用者按了返回鍵或切換頁面，可以用它立刻切斷還在傳輸的網路連接，節省頻寬與電量。

---

## 🔗 Related Topics
* [資深工程師級 Dio 封裝實戰 (Senior Dio Singleton Wrapper)](../synthesis/flutter-dio-senior-wrapper.md) — 學習企業級的封裝與攔截器設計。
* [Flutter 元件樹與宣告式 UI](flutter-widget-tree.md) — 了解如何將 API 取得的資料透過 `StatefulWidget` 渲染到畫面上。

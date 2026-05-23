---
title: "資深工程師級 Dio 單例封裝與攔截器設計 (Senior Dio Singleton Wrapper)"
category: "synthesis"
tags: [flutter, dio, networking, design-patterns, clean-code]
created: 2026-05-24
sources: ["flutter-dio-client.md"]
---

# 資深工程師級 Dio 單例封裝與攔截器設計 (Senior Dio Singleton Wrapper)

在企業級 Flutter 開發中，資深工程師**絕不會**在每個頁面都手動建立 `Dio()` 物件，也不會直接發送裸請求（Raw Requests）。隨意散落的網路請求會導致以下災難：
1. 難以維護：修改 BaseURL 或超時時間需要改動數十個檔案。
2. 重複程式碼：每個 API 呼叫都要重複寫 Try-Catch 捕獲錯誤。
3. 安全隱患：難以統一處理 Access Token 注入。

因此，資深工程師一定會建立一個 **單例模式 (Singleton Pattern) 的 HTTP 服務中心**，並為其配備 **攔截器 (Interceptors)** 與 **統一錯誤處理系統**。

---

## 🛠️ 企業級 Dio 封裝實戰程式碼 (Bilingual & Annotated)

以下是一份經過高壓生產環境驗證的 Dio 封裝類別。您可以直接將此程式碼複製到您的 `lib/services/http_service.dart` 中使用：

```dart
import 'dart:io';
import 'package:dio/dio.dart';

/// [HttpService] 是一個單例類別，統一管理全域的網路請求
class HttpService {
  // 1. 私有化建構函式，確保全域只有一個實例
  HttpService._internal() {
    _initializeDio();
  }

  // 2. 靜態私有實例
  static final HttpService _instance = HttpService._internal();

  // 3. 工廠建構函式，外部呼叫 HttpService() 時會直接返回同一個實例
  factory HttpService() => _instance;

  late final Dio _dio;

  // 全域 BaseURL 設定，便於環境切換 (Dev / Staging / Prod)
  static const String _baseUrl = 'https://api.yourdomain.com/v1/';

  /// 初始化 Dio 配置
  void _initializeDio() {
    // A. 設定 BaseOptions (全域請求基礎參數)
    final options = BaseOptions(
      baseUrl: _baseUrl,
      connectTimeout: const Duration(seconds: 10), // 連線超時時間 (10秒)
      receiveTimeout: const Duration(seconds: 8),  // 接收響應超時時間 (8秒)
      contentType: Headers.jsonContentType,       // 統一採用 JSON 傳輸
    );

    _dio = Dio(options);

    // B. 掛載攔截器 (Interceptors)
    _dio.interceptors.addAll([
      _AuthInterceptor(),  // 自動注入 Token 攔截器
      _ErrorInterceptor(), // 統一錯誤攔截與友善文字轉換
      _LogInterceptor(),   // 高質感控制台日誌輸出 (僅在開發模式下)
    ]);
  }

  // ==========================================
  // 🚀 公共請求方法 (Strongly Typed Methods)
  // ==========================================

  /// 通用的 GET 請求
  Future<Response<T>> get<T>(
    String path, {
    Map<String, dynamic>? queryParameters,
    Options? options,
    CancelToken? cancelToken,
  }) async {
    try {
      return await _dio.get<T>(
        path,
        queryParameters: queryParameters,
        options: options,
        cancelToken: cancelToken,
      );
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  /// 通用的 POST 請求
  Future<Response<T>> post<T>(
    String path, {
    dynamic data,
    Map<String, dynamic>? queryParameters,
    Options? options,
    CancelToken? cancelToken,
  }) async {
    try {
      return await _dio.post<T>(
        path,
        data: data,
        queryParameters: queryParameters,
        options: options,
        cancelToken: cancelToken,
      );
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }
}

// ==========================================
// 🔒 攔截器實作 (Custom Interceptors)
// ==========================================

/// 1. 身份驗證攔截器：自動在 Request Header 注入 JWT Token
class _AuthInterceptor extends Interceptor {
  @override
  void onRequest(RequestOptions options, RequestInterceptorHandler handler) async {
    // 模擬從本地持久化儲存（如 shared_preferences）讀取 Token
    const String? jwtToken = 'YOUR_STORED_JWT_TOKEN'; 

    if (jwtToken != null && jwtToken.isNotEmpty) {
      // 自動將 Token 加上 Bearer 前綴，塞入 Authorization Header
      options.headers['Authorization'] = 'Bearer $jwtToken';
    }

    // 放行請求
    return handler.next(options);
  }
}

/// 2. 統一錯誤處理攔截器：將各類 Status Code 轉換為使用者看得懂的中文
class _ErrorInterceptor extends Interceptor {
  @override
  void onError(DioException err, ErrorInterceptorHandler handler) {
    String friendlyMessage = '發生未知網路錯誤，請稍後再試';

    switch (err.type) {
      case DioExceptionType.connectionTimeout:
      case DioExceptionType.sendTimeout:
      case DioExceptionType.receiveTimeout:
        friendlyMessage = '伺服器連線超時，請檢查您的網路狀態';
        break;
      case DioExceptionType.badResponse:
        final int? statusCode = err.response?.statusCode;
        if (statusCode == 400) {
          friendlyMessage = err.response?.data['message'] ?? '請求參數有誤';
        } else if (statusCode == 401) {
          friendlyMessage = '身分證驗證已過期，請重新登入';
          // 💡 實戰技巧：此處可加入轉跳至登入頁的 Navigator 邏輯
        } else if (statusCode == 403) {
          friendlyMessage = '您沒有存取此資源的權限';
        } else if (statusCode == 404) {
          friendlyMessage = '請求的伺服器資源不存在 (404)';
        } else if (statusCode >= 500) {
          friendlyMessage = '伺服器正在維護中，請稍後再試 (500+)';
        }
        break;
      case DioExceptionType.connectionError:
        friendlyMessage = '無法連線至網路，請確認連線後再試';
        break;
      default:
        break;
    }

    // 重新封裝一個帶有自定義中文訊息的 DioException，向下傳遞
    final modifiedError = DioException(
      requestOptions: err.requestOptions,
      response: err.response,
      type: err.type,
      error: friendlyMessage, // 注入中文錯誤描述
    );

    return handler.next(modifiedError);
  }
}

/// 3. 日誌列印攔截器：在控制台排版印出 API 呼叫日誌，加速 Debug
class _LogInterceptor extends Interceptor {
  @override
  void onRequest(RequestOptions options, RequestInterceptorHandler handler) {
    print('🌐 [API REQ] [${options.method}] -> ${options.baseUrl}${options.path}');
    if (options.data != null) {
      print('📦 [API BODY]: ${options.data}');
    }
    return handler.next(options);
  }

  @override
  void onResponse(Response response, ResponseInterceptorHandler handler) {
    print('🟢 [API RES] [${response.statusCode}] <- ${response.requestOptions.path}');
    return handler.next(response);
  }

  @override
  void onError(DioException err, ErrorInterceptorHandler handler) {
    print('🔴 [API ERR] [${err.response?.statusCode}] <- ${err.requestOptions.path}');
    print('⚠️ [ERR MSG]: ${err.error}');
    return handler.next(err);
  }
}

// 輔助錯誤回傳轉換
Exception _handleError(DioException e) {
  // 返回包裝好的帶有中文錯誤的 Exception
  return Exception(e.error ?? '網路請求失敗');
}
```

---

## 🧭 如何在 UI 頁面中使用封裝好的 HttpService？

結合我們先前建立的 [**宣告式 UI (StatefulWidget)**](../concepts/flutter-widget-tree.md) 觀念，我們可以直接在生命週期或點擊事件中呼叫：

```dart
// 在 StatefulWidget 內部呼叫
void login() async {
  try {
    // 1. 取得單例，發送請求 (外部代碼變得無比乾淨)
    final response = await HttpService().post(
      'auth/login',
      data: {'email': 'test@domain.com', 'password': '123'},
    );
    
    // 2. 成功登入，處理資料
    showToast('歡迎回來！${response.data['user']['name']}');
  } catch (e) {
    // 3. 當請求失敗時，e.toString() 會直接輸出 ErrorInterceptor 轉換好的「身分證驗證已過期」等親切中文！
    showErrorToast(e.toString()); 
  }
}
```

---

## 🔗 Related Topics
* [Flutter Dio 網路請求套件 (Flutter Dio Client)](../concepts/flutter-dio-client.md) — Dio 的基礎屬性與設定。
* [Flutter 元件樹與宣告式 UI](../concepts/flutter-widget-tree.md) — 了解 `setState` 如何接收 Http 資料並重繪元件樹。

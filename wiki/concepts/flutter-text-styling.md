---
title: "Flutter 文字樣式與色彩設計 (Flutter Text Styling & Colors)"
category: "concept"
tags: [flutter, typography, styling]
created: 2026-05-24
sources: ["user-request-topic-flutter-layout"]
---

# Flutter 文字樣式與色彩設計 (Flutter Text Styling & Colors)

---

## 📖 Definition / Overview
在 Flutter 中，文字的呈現使用 **`Text` Widget**，而樣式的控制則完全交由 **`TextStyle` 物件**。色彩方面，則使用 **`Color`** 或內置的 **`Colors` 類別**。
資深工程師在處理文字樣式時，絕不會隨意在各個檔案寫死樣式數值，而是會高度整合 **設計系統 (Design System / Theme)**。

---

## 🛠️ TextStyle 與色彩核心語法

### 1. 基礎 TextStyle 配置
```dart
Text(
  "Hello Flutter!",
  style: TextStyle(
    color: const Color(0xFF1E293B), // 使用 16 進位色碼 (ARGB 格式：前兩位 FF 表示不透明度 100%)
    fontSize: 24.0,                 // 字體大小 (邏輯像素，非死板的 pt)
    fontWeight: FontWeight.bold,    // 字體粗細 (FontWeight.w700)
    fontStyle: FontStyle.italic,    // 斜體
    letterSpacing: 1.5,             // 字元間距
    height: 1.4,                    // 行高比例 (1.4 倍，相當於 CSS line-height)
    decoration: TextDecoration.underline, // 加底線
  ),
)
```

### 2. 精美色彩的表示方式
Flutter 提供多種宣告色彩的方法：
* **命名色彩**：`Colors.blue`, `Colors.amber.shade900`
* **十六進位 AARRGGBB**：`Color(0xFF2563EB)`（最常用，強烈推薦）
* **RGB 格式**：`Color.fromARGB(255, 37, 99, 235)`

---

## 📈 資深工程師的「主題化 (Theme)」進階玩法

在真實的企業級專案中，若要將文字大小或顏色統一管理，隨意在每個 Widget 寫死 `TextStyle` 是非常糟糕的做法。當設計師要求將所有的標題由藍色改為黑色時，寫死的程式碼會帶來巨大的災難。

### 1. 利用 `Theme` 統一文字資源
資深工程師會透過 `Theme.of(context)` 取得全域定義的主題樣式：

```dart
// 在 App 入口定義全局 TextTheme
MaterialApp(
  theme: ThemeData(
    primaryColor: const Color(0xFF2563EB),
    textTheme: const TextTheme(
      headlineLarge: TextStyle(fontSize: 32.0, fontWeight: FontWeight.bold, color: Color(0xFF0F172A)),
      bodyMedium: TextStyle(fontSize: 16.0, height: 1.5, color: Color(0xFF334155)),
    ),
  ),
  home: const MyHomeScreen(),
);
```

### 2. 在 UI 頁面中引用主題
```dart
// 在 Widget build 中動態引用，極易進行深淺色模式切換 (Dark Mode)
Text(
  "這是大標題",
  style: Theme.of(context).textTheme.headlineLarge,
)
```

### 3. 微調局部樣式：使用 `copyWith`
若引用了全域樣式，但想微調部分屬性（例如改變某個標題的顏色）：
```dart
Text(
  "微調過的大標題",
  style: Theme.of(context).textTheme.headlineLarge?.copyWith(
    color: Colors.red, // 僅覆蓋顏色屬性，其餘 fontSize、fontWeight 依然複用主題設定
  ),
)
```

---

## 🔗 Related Topics
* [Flutter 基礎切版佈局](flutter-layout-basics.md) — 將設計好的文字嵌入排版容器。
* [資深工程師必備 Flutter UI 指南](../synthesis/flutter-senior-ui-guide.md) — 整合性的實戰指南。

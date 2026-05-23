---
title: "Flutter 基礎切版佈局 (Flutter Layout Basics)"
category: "concept"
tags: [flutter, layout, ui-design]
created: 2026-05-24
sources: ["user-request-topic-flutter-layout"]
---

# Flutter 基礎切版佈局 (Flutter Layout Basics)

---

## 📖 Definition / Overview
Flutter 的佈局（Layout）系統建立在一套簡單卻極其強大的約束機制之上。
> 💡 **資深工程師必背口訣**：
> **Constraints go down. Sizes go up. Parent sets position.**
> （約束向下傳遞。尺寸向上回傳。父元件決定擺放位置。）

---

## 🛠️ 核心切版元件介紹

### 1. 線性佈局：Row & Column
用於橫向（Row）或縱向（Column）排列元件。

#### 關鍵屬性：
* **`mainAxisAlignment`**：主軸對齊（Row 的主軸是橫向，Column 的主軸是縱向）。
* **`crossAxisAlignment`**：交叉軸對齊（與主軸垂直的方向）。

```dart
// 縱向排列三個區塊
Column(
  mainAxisAlignment: MainAxisAlignment.spaceBetween, // 平均分配空間，頭尾貼邊
  crossAxisAlignment: CrossAxisAlignment.center,      // 橫向置中
  children: [
    WidgetA(),
    WidgetB(),
    WidgetC(),
  ],
)
```

### 2. 空間與裝飾：Container & Padding
* **`Padding`**：只負責留白，效能最好。**資深工程師首選**。
* **`Container`**：功能強大的多功能盒子，支援背景色、邊框、圓角、尺寸限制、漸層等。

```dart
// 使用 Container 設計一個精美的卡片
Container(
  width: double.infinity, // 寬度撐滿父元件
  padding: const EdgeInsets.all(16.0), // 內邊距
  margin: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 10.0), // 外邊距
  decoration: BoxDecoration(
    color: Colors.white,
    borderRadius: BorderRadius.circular(12.0), // 圓角
    boxShadow: [
      BoxShadow(
        color: Colors.black.withOpacity(0.05),
        blurRadius: 10.0,
        offset: const Offset(0, 4), // 陰影偏移
      ),
    ],
  ),
  child: const Text("這是卡片內容"),
)
```

### 3. 重疊佈局：Stack & Positioned
類似 CSS 的 `position: absolute`，用於重疊多個元件（如圖片上疊加文字或標籤）。

```dart
Stack(
  children: [
    // 底層圖片
    Image.network('https://example.com/banner.png'),
    // 疊加在右上角的小標籤
    Positioned(
      top: 8.0,
      right: 8.0,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 8.0, vertical: 4.0),
        color: Colors.red,
        child: const Text('HOT', style: TextStyle(color: Colors.white)),
      ),
    ),
  ],
)
```

### 4. 彈性比例分配：Expanded & Flexible
在 `Row` 或 `Column` 中分配剩餘空間。
* **`Expanded`**：強行填滿剩餘的所有空間。
* **`Flexible`**：允許子元件擁有彈性尺寸，但不會強行撐滿。

```dart
Row(
  children: [
    const Text("固定寬度標題"),
    const SizedBox(width: 8.0), // 常用於微調間距的隱形盒子
    Expanded(
      child: Container(
        color: Colors.grey[200],
        child: const Text("此欄位會自動拉伸填滿剩餘的寬度"),
      ),
    ),
  ],
)
```

---

## ⚖️ 資深工程師的效能優化準則

* **優先使用 `SizedBox` / `Padding` 代替 `Container`**：若只需要間距或內邊距，`Padding` 與 `SizedBox` 的渲染消耗遠低於 `Container`（因為 Container 底層包含複雜的裝飾、轉換等繪製物件）。
* **多使用 `const` 構造函數**：在所有不需要變動的 Widget 前面加上 `const`。這會告訴 Flutter 在重繪時直接複用記憶體，能顯著提升滾動流暢度。

---

## 🔗 Related Topics
* [Flutter 元件樹與宣告式 UI](flutter-widget-tree.md) — 了解宣告式 UI 的運作機制。
* [Flutter 文字樣式設計 (Flutter Text Styling)](flutter-text-styling.md) — 如何在切版中設計文字與色彩。

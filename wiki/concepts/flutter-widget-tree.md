---
title: "Flutter 元件樹與宣告式 UI (Widget Tree & Declarative UI)"
category: "concept"
tags: [flutter, UI, architecture]
created: 2026-05-24
sources: ["user-request-topic-flutter-layout"]
---

# Flutter 元件樹與宣告式 UI (Widget Tree & Declarative UI)

---

## 📖 Definition / Overview
Flutter 採用的是 **「宣告式 UI (Declarative UI)」** 的設計範式，這與傳統 Android (XML) 或 iOS (Storyboard/UIKit) 的「命令式 UI (Imperative UI)」有本質上的不同。在 Flutter 中，**「一切皆為元件 (Everything is a Widget)」**。畫面的呈現是透過一個層層嵌套的 **元件樹 (Widget Tree)** 來表示。

### 核心公式
$$\text{UI} = f(\text{State})$$
在 Flutter 中，您不需要手動去尋找某個畫面的元件（如 `findViewById`）並修改它。您只需要改變**狀態 (State)**，Flutter 的渲染引擎就會重新呼叫建構函式，重新繪製對應的元件樹。

---

## 🛠️ Detailed Explanation & Mechanics

在 Flutter 中，UI 的構建有兩個最基礎的元件類別：

### 1. StatelessWidget (無狀態元件)
當元件的畫面僅依賴傳入的參數，且在生命週期內不會主動發生改變時使用。
```dart
import 'package:flutter/material.dart';

class SimpleCard extends StatelessWidget {
  final String title;

  // 構造函數，傳入參數
  const SimpleCard({super.key, required this.title});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16.0),
      color: Colors.blue,
      child: Text(title),
    );
  }
}
```

### 2. StatefulWidget (有狀態元件)
當元件需要根據使用者互動或非同步資料（例如點擊、API 請求）而動態改變自身畫面時使用。它由兩個類別組成：元件本身與其狀態類別。
```dart
import 'package:flutter/material.dart';

class CounterWidget extends StatefulWidget {
  const CounterWidget({super.key});

  @override
  State<CounterWidget> createState() => _CounterWidgetState();
}

class _CounterWidgetState extends State<CounterWidget> {
  int _counter = 0;

  void _increment() {
    setState(() {
      // 呼叫 setState 會觸發 build 方法重新執行，刷新 UI
      _counter++;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Text('點擊次數: $_counter'),
        ElevatedButton(
          onPressed: _increment,
          child: const Text('加 1'),
        ),
      ],
    );
  }
}
```

---

## 💡 資深工程師心法 (Senior Insights)
* **Widget 是不可變的 (Immutable)**：在 Flutter 中，Widget 只是輕量級的組態描述檔案，它的創建與銷毀代價極低。Flutter 底層還有 `Element Tree` 和 `RenderObject Tree` 來真正負責持有狀態與繪製，因此不要害怕在 build 方法中嵌套 Widget。
* **保持 Build 方法純粹**：避免在 `build()` 方法中執行耗時的運算或 API 請求，因為 build 會被頻繁觸發。

---

## 🔗 Related Topics
* [Flutter 基礎切版佈局 (Flutter Layout Basics)](flutter-layout-basics.md) — 學習如何排版 Widget。
* [Flutter 文字樣式設計 (Flutter Text Styling)](flutter-text-styling.md) — 學習如何微調文字與顏色。
